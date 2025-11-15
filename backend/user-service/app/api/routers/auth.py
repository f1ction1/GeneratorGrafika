from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from db import get_db
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from services.auth import register_user, login_user
from core.security import get_current_user
from models import User, Employer, Employee

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user(db, req)
    return {"access_token": token}


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(db, req.email, req.password)
    return {"access_token": token}


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # re-fetch user in this DB session to avoid cross-session issues
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # delete user and let DB-level ON DELETE cascades / SET NULL do the rest
    db.delete(user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)