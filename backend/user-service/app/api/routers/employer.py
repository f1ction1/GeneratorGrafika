from fastapi import APIRouter, Depends, status
from schemas.employer import EmployerCreate, EmployerBase
from services.employer_service import EmployerService
from core.security import get_current_user, RoleChecker
from models import User
from api.dependencies.services import get_employer_service

router = APIRouter(
    prefix="/employer",
) 

@router.post("/", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(RoleChecker(["owner"]))])
def create_employer(
    payload: EmployerCreate,
    current_user: User = Depends(get_current_user),
    service: EmployerService = Depends(get_employer_service)
):
    service.create_employer(user=current_user, data=payload)

@router.get("/{employer_id}", status_code=status.HTTP_200_OK, response_model=EmployerBase, dependencies=[Depends(RoleChecker(["owner", "manager"]))])
def get_employer(employer_id: int, service: EmployerService = Depends(get_employer_service)):
    employer = service.get_employer(employer_id)
    return employer
