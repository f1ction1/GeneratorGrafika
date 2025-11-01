from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db import get_db
from schemas.auth import RegisterRequest, TokenResponse
from services.auth import register_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user(db, req)
    return {"access_token": token}