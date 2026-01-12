from fastapi import APIRouter, Depends, status
from schemas.schedule import ScheduleRequest
from services.schedule_service import ScheduleService
from core.security import get_current_user, RoleChecker
from models import User
from api.dependencies.services import get_schedule_service

router = APIRouter(
    prefix="/schedule",
) 

@router.post("/generate", status_code=status.HTTP_200_OK, dependencies=[Depends(RoleChecker(["owner"]))])
def create_employer(
    payload: ScheduleRequest,
    current_user: User = Depends(get_current_user),
    service: ScheduleService = Depends(get_schedule_service)
):
    return service.generate_schedule(user=current_user, request=payload)