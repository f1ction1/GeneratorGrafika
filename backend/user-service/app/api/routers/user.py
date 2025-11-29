from fastapi import APIRouter, Depends, Path, HTTPException
from sqlalchemy.orm import Session
from schemas.auth import UserUpdate
from services.user_service import UserService
from core.security import get_current_user, RoleChecker
from models import User
from api.dependencies.services import get_user_service

router = APIRouter(
    prefix="",  # changed from "/api/users"
    tags=["users"]
)

@router.get("/users/me", status_code=200)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    user = service.get_user(current_user.id)
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role
    }

@router.put("/users", status_code=200)  # changed from "/me"
def update_my_user(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    user = service.update_user(current_user.id, payload)
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }
