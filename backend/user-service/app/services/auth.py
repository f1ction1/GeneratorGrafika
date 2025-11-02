from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.User import User
from schemas.auth import RegisterRequest
from core.security import hash_password, create_jwt, verify_password

def register_user(db: Session, req: RegisterRequest) -> str:
    if req.password != req.password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
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

    exp = int((datetime.utcnow() + timedelta(days=7)).timestamp())
    payload = {"id": str(user.id), "email": user.email, "role": user.role, "exp": exp}
    token = create_jwt(payload)
    return token

def login_user(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    exp = int((datetime.utcnow() + timedelta(days=7)).timestamp())
    payload = {"id": str(user.id), "email": user.email, "role": user.role, "exp": exp}
    token = create_jwt(payload)
    return token
