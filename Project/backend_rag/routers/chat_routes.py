from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from database.db_setup import get_db
from database.models import ChatSession, ChatMessage
from rag_engine import query_ip_assistant, response_cache

router = APIRouter(
    prefix="/api",
    tags=["Chat & RAG Engine"]
)

# Pydantic schema for incoming chat request from frontend React app
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None
    jurisdiction: str = "India"
    language: str = "English"

# NEW: dedicated model for the citation payload
class SourceMetadata(BaseModel):
    file_name: str
    file_path: Optional[str] = None
    page_number: int
    act_name: Optional[str] = None
    section: Optional[str] = None

class ChatResponse(BaseModel):
    status: str
    session_id: int
    answer: str
    primary_citation: str
    confidence_score: float
    external_links: List[str] = []
    sources: List[str] = []
    source_metadata: Optional[SourceMetadata] = None
    citations: List[SourceMetadata] = []
    requires_paid_access: bool = False
    # NEW: include file_name for report generation
    can_generate_report: bool = True

# NEW: Model for getting session metadata
class SessionInfoResponse(BaseModel):
    session_id: int
    title: str
    message_count: int
    created_at: str
    last_updated: str
    can_generate_report: bool = True

@router.post("/chat", response_model=ChatResponse)
def handle_chat_message(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Handles user chat queries, manages chat sessions in PostgreSQL, 
    fetches conversation history, and invokes the RAG engine.
    
    NEW: Now supports report generation via the session_id returned in response.
    """
    try:
        # 1. If no session_id is provided, create a new chat session
        if not request.session_id:
            new_session = ChatSession(user_id=1, title=request.message[:30] + "...")
            db.add(new_session)
            db.commit()
            db.refresh(new_session)
            active_session_id = new_session.id
        else:
            active_session_id = request.session_id
            # Verify session exists
            session_obj = db.query(ChatSession).filter(ChatSession.id == active_session_id).first()
            if not session_obj:
                raise HTTPException(status_code=404, detail="Chat session not found")

        # 2. Fetch past messages for context (sliding window of last 6 messages)
        past_messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == active_session_id
        ).order_by(ChatMessage.created_at.asc()).all()

        formatted_history = [
            {"role": msg.role, "content": msg.content} for msg in past_messages[-6:]
        ]

        # 3. Save user message to database
        user_msg_db = ChatMessage(session_id=active_session_id, role="user", content=request.message)
        db.add(user_msg_db)
        db.commit()

        # 4. Check cache for instant response if query matches without complex history dependencies
        cache_key = f"{request.jurisdiction}_{request.language}_{request.message.strip().lower()}"
        if cache_key in response_cache:
            ai_result = response_cache[cache_key]
        else:
            # Invoke RAG engine if not cached
            ai_result = query_ip_assistant(
                query=request.message,
                jurisdiction=request.jurisdiction,
                language=request.language,
                response_language=request.language,
                chat_history=formatted_history
            )
            # Store successful results in cache
            if ai_result.get("status") == "SUCCESS":
                response_cache[cache_key] = ai_result

        ai_answer = ai_result.get("answer", "I couldn't process that response.")

        # 5. Save assistant response to database
        assistant_msg_db = ChatMessage(session_id=active_session_id, role="assistant", content=ai_answer)
        db.add(assistant_msg_db)
        db.commit()

        # 6. Return response to frontend
        # NEW: Always include can_generate_report = True (user can now call /api/generate-report endpoint)
        return {
            "status": ai_result.get("status", "SUCCESS"),
            "session_id": active_session_id,
            "answer": ai_answer,
            "primary_citation": ai_result.get("primary_citation", "Statutory Reference"),
            "confidence_score": ai_result.get("confidence_score", 0.95),
            "external_links": ai_result.get("external_links", []),
            "sources": ai_result.get("sources", []),
            "source_metadata": ai_result.get("source_metadata"),
            "citations": ai_result.get("citations", []),
            "requires_paid_access": ai_result.get("requires_paid_access", False),
            "can_generate_report": True  # NEW field
        }

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# NEW: Endpoint to get session information for report generation
@router.get("/sessions/{session_id}", response_model=SessionInfoResponse)
def get_session_info(session_id: int, db: Session = Depends(get_db)):
    """
    Get information about a chat session.
    Useful for verifying session exists before calling report generation.
    """
    try:
        session_obj = db.query(ChatSession).filter(
            ChatSession.id == session_id
        ).first()
        
        if not session_obj:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Count messages in this session
        message_count = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).count()
        
        return {
            "session_id": session_obj.id,
            "title": session_obj.title,
            "message_count": message_count,
            "created_at": session_obj.created_at.isoformat() if session_obj.created_at else "",
            "last_updated": session_obj.updated_at.isoformat() if session_obj.updated_at else "",
            "can_generate_report": message_count > 0  # Only if there are messages
        }
        
    except Exception as e:
        print(f"Error getting session info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# NEW: Endpoint to list all sessions for a user
@router.get("/sessions")
def list_user_sessions(user_id: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    """
    List all chat sessions for a user.
    Useful for showing chat history in sidebar or dashboard.
    """
    try:
        sessions = db.query(ChatSession).filter(
            ChatSession.user_id == user_id
        ).order_by(ChatSession.created_at.desc()).limit(limit).all()
        
        session_list = []
        for session in sessions:
            message_count = db.query(ChatMessage).filter(
                ChatMessage.session_id == session.id
            ).count()
            
            session_list.append({
                "session_id": session.id,
                "title": session.title,
                "message_count": message_count,
                "created_at": session.created_at.isoformat() if session.created_at else "",
                "last_updated": session.updated_at.isoformat() if session.updated_at else "",
                "can_generate_report": message_count > 0
            })
        
        return {
            "status": "SUCCESS",
            "total": len(session_list),
            "sessions": session_list
        }
        
    except Exception as e:
        print(f"Error listing sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))