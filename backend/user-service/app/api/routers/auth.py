from fastapi import APIRouter, Depends, HTTPException, status, Response, BackgroundTasks
from sqlalchemy.orm import Session

from db import get_db
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, PasswordResetRequest, PasswordResetConfirm
from services.auth import register_user, login_user, generate_password_reset_token, reset_password
from core.security import get_current_user
from models import User, Employer, Employee
from services.email_service import send_registration_email, send_password_reset_email

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(
    req: RegisterRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    token = register_user(db, req)
    new_user = db.query(User).filter(User.email == req.email).first()
    recipient_email = req.email
    full_name = req.email
    if new_user:
        recipient_email = getattr(new_user, "email", recipient_email) or recipient_email
        name_from_fields = " ".join(
            filter(None, [getattr(new_user, "first_name", None), getattr(new_user, "last_name", None)])
        ).strip()
        full_name = getattr(new_user, "full_name", None) or name_from_fields or recipient_email
    background_tasks.add_task(send_registration_email, recipient_email, full_name)
    return {"access_token": token}


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(db, req.email, req.password)
    return {"access_token": token}


@router.post("/password/reset/request", status_code=status.HTTP_202_ACCEPTED)
async def request_password_reset(
    req: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    token = generate_password_reset_token(db, req.email)
    if token:
        background_tasks.add_task(send_password_reset_email, req.email, token)
    return {"message": "If the email exists, password reset instructions were sent."}


@router.post("/password/reset/confirm")
def confirm_password_reset(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    reset_password(db, req.token, req.new_password, req.new_password_confirm)
    return {"message": "Password has been reset."}


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