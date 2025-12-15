from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.User import User
from schemas.auth import RegisterRequest
from core.security import hash_password, create_jwt, verify_password, create_reset_token, verify_reset_token
from core.logging_config import get_logger

logger = get_logger(__name__)

def register_user(db: Session, req: RegisterRequest) -> str:
    logger.info(f"Registration attempt for email: {req.email}")
    
    if req.password != req.password_confirm:
        logger.warning(f"Password mismatch during registration for email: {req.email}")
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        logger.warning(f"Registration failed - email already exists: {req.email}")
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed = hash_password(req.password)
    user = User(
        email=req.email,
        first_name=req.first_name,   # <-- use value from request
        last_name=req.last_name,     # <-- use value from request
        password=hashed,
        role=req.role,               # <-- use value from request
        employer_id=None
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"User registered successfully - ID: {user.id}, Email: {user.email}, Role: {user.role}")

    exp = int((datetime.utcnow() + timedelta(days=7)).timestamp())
    payload = {"id": str(user.id), "email": user.email, "role": user.role, "exp": exp}
    token = create_jwt(payload)
    return token

def login_user(db: Session, email: str, password: str) -> str:
    logger.info(f"Login attempt for email: {email}")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.warning(f"Login failed - user not found: {email}")
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(password, user.password):
        logger.warning(f"Login failed - invalid password for email: {email}")
        raise HTTPException(status_code=400, detail="Invalid email or password")

    logger.info(f"User logged in successfully - ID: {user.id}, Email: {user.email}")

    exp = int((datetime.utcnow() + timedelta(days=7)).timestamp())
    payload = {"id": str(user.id), "email": user.email, "role": user.role, "exp": exp}
    token = create_jwt(payload)
    return token

def generate_password_reset_token(db: Session, email: str) -> str | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    return create_reset_token(user.id) # type: ignore

def reset_password(db: Session, token: str, new_password: str, new_password_confirm: str) -> None:
    if new_password != new_password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    user_id = verify_reset_token(token)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password = hash_password(new_password) # type: ignore
    db.commit()
