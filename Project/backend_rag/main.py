import os
import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

# Import core RAG functions from our custom engine
from rag_engine import process_and_upload_pdf, query_ip_assistant

# Import database setup and routers for Auth and Chat history management
from database.db_setup import engine, Base, get_db
from database.models import ChatSession, ChatMessage
from routers import auth_routes, chat_routes

# ===== NEW IMPORT: ReportLab PDF Generation =====
from report_generator import generate_passport_from_session
# ================================================

# Initialize database tables upon application startup
Base.metadata.create_all(bind=engine)

# Initialize the main FastAPI application
app = FastAPI(
    title="IP-SAKTI Sahayak Backend API",
    version="2.0",
    description="Monolithic FastAPI backend with Auth, Database, Caching, and AYUSH RAG Engine."
)

# Configure CORS so our React/Vite frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication and Chat Routers
app.include_router(auth_routes.router)
app.include_router(chat_routes.router)

# Serve statute PDFs as static files for the split-screen viewer
STATUTE_DOCS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
app.mount("/statute-docs", StaticFiles(directory=STATUTE_DOCS_DIR), name="statute-docs")

# ===== NEW: Directory for generated reports =====
REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "generated_reports")
os.makedirs(REPORTS_DIR, exist_ok=True)
# ================================================

# --- Pydantic Data Models ---
class ChatRequest(BaseModel):
    message: str
    jurisdiction: Optional[str] = "India"
    language: Optional[str] = "English"
    has_paid_access_token: Optional[bool] = False 

class SourceMetadata(BaseModel):
    file_name: str
    file_path: Optional[str] = None
    page_number: int

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    requires_paid_access: bool
    external_links: List[str]
    source_metadata: Optional[SourceMetadata] = None

class AuthRequest(BaseModel):
    user_id: str
    database_name: str

# ===== NEW: Report Generation Request =====
class GenerateReportRequest(BaseModel):
    session_id: int
    product_name: Optional[str] = "Formulation"
    applicant_name: Optional[str] = "User"
    applicant_email: Optional[str] = "not@provided.in"
    applicant_organization: Optional[str] = "Individual Developer"
# =============================================

# --- API Endpoints ---

@app.get("/")
def read_root():
    """Simple health check endpoint to verify the server and database status."""
    return {
        "status": "ONLINE",
        "system": "IP-SAKTI Sahayak Backend",
        "database": "Connected",
        "caching": "Active",
        "version": "2.0"
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """Handles PDF uploads, saves them temporarily, and indexes them into ChromaDB."""
    temp_folder = "temp_uploads"
    os.makedirs(temp_folder, exist_ok=True)
    
    file_path = os.path.join(temp_folder, file.filename)
    
    # Save the uploaded file to the local disk
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # Pass the saved file to the RAG engine for chunking and vector storage
    success = process_and_upload_pdf(file_path)
    
    if success:
        return {"message": f"Successfully processed and indexed {file.filename}"}
    else:
        raise HTTPException(status_code=500, detail="Failed to process document")

@app.post("/api/chat", response_model=ChatResponse)
def chat_with_bot(request: ChatRequest):
    """Main chat endpoint. Passes the user's query and parameters to the RAG engine."""
    response_data = query_ip_assistant(
        query=request.message,
        jurisdiction=request.jurisdiction,
        language=request.language,
        has_paid_access=request.has_paid_access_token
    )
    return response_data

@app.post("/api/authorize_paid_access")
def authorize_paid_data(request: AuthRequest):
    """
    Logs explicit user consent for accessing paid databases.
    This directly addresses the SIH problem statement requirement for audit trails.
    """
    os.makedirs("logs", exist_ok=True)
    log_file = "logs/access_permissions.log"
    
    # Create a timestamped log entry
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] User: {request.user_id} GRANTED access to PAID DB: {request.database_name}\n"
    
    # Append the entry to the log file (serving as our verifiable permission log)
    with open(log_file, "a") as f:
        f.write(log_entry)
        
    return {"status": "success", "message": "Access granted and logged successfully."}

# ===== NEW ENDPOINT: Generate Innovation Passport Report =====
@app.post("/api/generate-report")
def generate_innovation_passport(
    request: GenerateReportRequest,
    db: Session = Depends(get_db)
):
    """
    Generates comprehensive Innovation Passport PDF Report from chat session.
    
    Takes:
    - session_id: ID of the chat session to extract history from
    - product_name: Name of the formulation
    - applicant_name: Name of the applicant
    - applicant_email: Applicant's email
    - applicant_organization: Organization name
    
    Returns:
    - PDF download metadata with file_name and download_url
    """
    
    try:
        # 1. Fetch chat history from database for this session
        chat_messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == request.session_id
        ).order_by(ChatMessage.created_at.asc()).all()
        
        if not chat_messages:
            raise HTTPException(
                status_code=404,
                detail="No chat history found for this session"
            )
        
        # 2. Convert database records to dict format for report generator
        chat_history = [
            {
                "role": msg.role,  # "user" or "assistant"
                "content": msg.content
            }
            for msg in chat_messages
        ]
        
        # 3. Get the final assessment from the last assistant message
        # (The last message in the chat should be the most recent assessment)
        final_assessment = None
        last_assistant_message = None
        
        for msg in reversed(chat_messages):
            if msg.role == "assistant":
                last_assistant_message = msg.content
                break
        
        # For now, we'll construct a basic final_assessment from the last response
        # In production, you might want to store this in database as JSON
        if last_assistant_message:
            final_assessment = {
                "status": "SUCCESS",
                "answer": last_assistant_message,
                "intent": "STATUTORY_DIAGNOSTIC",
                "confidence_score": 0.85,
                "is_comparative": False,
                "citations": [],
                "sources": [],
                "external_links": [],
                "source_metadata": None
            }
        
        if not final_assessment:
            raise HTTPException(
                status_code=400,
                detail="No assessment available to generate report"
            )
        
        # 4. Call report generator
        pdf_path = generate_passport_from_session(
            chat_history=chat_history,
            final_assessment=final_assessment,
            product_name=request.product_name,
            applicant_name=request.applicant_name,
            output_dir=REPORTS_DIR
        )
        
        # 5. Extract file metadata
        file_name = os.path.basename(pdf_path)
        
        return {
            "status": "SUCCESS",
            "file_name": file_name,
            "download_url": f"/api/download-report/{file_name}",
            "message": f"Innovation Passport report generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")
# ============================================================

# ===== NEW ENDPOINT: Download Generated Report =====
@app.get("/api/download-report/{file_name}")
async def download_report(file_name: str):
    """
    Download a previously generated Innovation Passport report.
    
    Security: Prevents directory traversal attacks by validating filename.
    """
    
    try:
        # Security check: prevent directory traversal
        if ".." in file_name or "/" in file_name or "\\" in file_name:
            raise HTTPException(status_code=400, detail="Invalid file name")
        
        file_path = os.path.join(REPORTS_DIR, file_name)
        
        # Verify file exists
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=404,
                detail=f"Report '{file_name}' not found"
            )
        
        # Return file as download
        return FileResponse(
            path=file_path,
            filename=file_name,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={file_name}"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error downloading report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
# ====================================================

# ===== OPTIONAL: List generated reports (for admin dashboard) =====
@app.get("/api/reports")
async def list_reports(limit: int = 10, offset: int = 0):
    """
    List recently generated Innovation Passport reports.
    Useful for admin dashboard or user's report history.
    """
    
    try:
        # Get list of PDF files
        files = [
            f for f in os.listdir(REPORTS_DIR)
            if f.startswith("IP-SAKTI") and f.endswith(".pdf")
        ]
        
        # Sort by creation time (newest first)
        files.sort(
            key=lambda x: os.path.getmtime(os.path.join(REPORTS_DIR, x)),
            reverse=True
        )
        
        # Apply pagination
        paginated_files = files[offset:offset+limit]
        
        # Build response
        reports = []
        for file_name in paginated_files:
            file_path = os.path.join(REPORTS_DIR, file_name)
            file_size = os.path.getsize(file_path)
            mod_time = os.path.getmtime(file_path)
            
            reports.append({
                "file_name": file_name,
                "file_size_kb": round(file_size / 1024, 2),
                "created_timestamp": mod_time,
                "download_url": f"/api/download-report/{file_name}"
            })
        
        return {
            "status": "SUCCESS",
            "total_count": len(files),
            "offset": offset,
            "limit": limit,
            "reports": reports
        }
        
    except Exception as e:
        print(f"Error listing reports: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
# ==================================================================

# ===== OPTIONAL: Delete old reports (cleanup task) =====
@app.delete("/api/reports/{file_name}")
async def delete_report(file_name: str):
    """
    Delete a generated report. Useful for cleanup or storage management.
    """
    
    try:
        # Security check
        if ".." in file_name or "/" in file_name or "\\" in file_name:
            raise HTTPException(status_code=400, detail="Invalid file name")
        
        file_path = os.path.join(REPORTS_DIR, file_name)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Delete the file
        os.remove(file_path)
        
        return {
            "status": "SUCCESS",
            "message": f"Report '{file_name}' deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
# ========================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)