from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from user_service.db import get_db
from user_service.schemas.employer import EmployerCreate
from user_service.services.employer_service import EmployerService
from user_service.core.security import get_current_user
from user_service.models import User, Employer

router = APIRouter(
    prefix="/employer",
    dependencies=[Depends(get_current_user)]
) 

@router.post("/", status_code=status.HTTP_204_NO_CONTENT)
def create_employer(
    payload: EmployerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = EmployerService(db)
    service.create_employer(user=current_user, data=payload)
