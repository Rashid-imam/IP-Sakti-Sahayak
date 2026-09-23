from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database.db_setup import get_db
from database.models import User
from auth.hashing import Hash
from auth.jwt_handler import create_access_token

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# Pydantic schemas for request validation
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "normal_user"  # Can be normal_user, vaidya, admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def register_user(request: UserSignup, db: Session = Depends(get_db)):
    """Register a new user and hash their password before saving to DB."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered with us."
        )
    
    # Create new user instance with hashed password
    new_user = User(
        name=request.name,
        email=request.email,
        hashed_password=Hash.bcrypt(request.password),
        role=request.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "status": "SUCCESS",
        "message": "User registered successfully",
        "user_id": new_user.id,
        "email": new_user.email
    }

@router.post("/login")
def login_user(request: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user credentials and return a JWT access token."""
    user = db.query(User).filter(User.email == request.email).first()
    
    # Verify user existence and password match
    if not user or not Hash.verify(user.hashed_password, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    # Generate JWT token
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return {
        "status": "SUCCESS",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }