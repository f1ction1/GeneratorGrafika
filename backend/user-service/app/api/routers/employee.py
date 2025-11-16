from fastapi import APIRouter, Depends, status
from schemas.employee import EmployeeCreate, EmployeeBase, EmployeeUpdate, EmployeeDelete
from services.employee_service import EmployeeService
from core.security import get_current_user, RoleChecker
from models import User
from api.dependencies.services import get_employee_service
from typing import List

router = APIRouter(
    prefix="/employee",
) 

@router.post("", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(RoleChecker(["owner"]))])
def create_employee(
    payload: EmployeeCreate,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service)
):
    service.create_employee(user=current_user, data=payload)

# @router.get("", status_code=status.HTTP_200_OK, response_model=EmployeeBase, dependencies=[Depends(RoleChecker(["owner", "manager"]))])
# def get_employee(
#     current_user: User = Depends(get_current_user),
#     service: EmployeeService = Depends(get_employee_service)):
#     employee = service.get_employee(current_user)
#     return employee

@router.put("", status_code=status.HTTP_200_OK, response_model=EmployeeBase, dependencies=[Depends(RoleChecker(["owner", "manager"]))])
def update_employee(
    payload: EmployeeUpdate,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service)
):
    return service.update_employee(user=current_user, data=payload)

@router.delete("",status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(RoleChecker(["owner", "manager"]))]) # response_model=EmployeeBase,
def delete_employee(
    payload: EmployeeDelete,
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service)
):
    return service.delete_employee(user=current_user, data=payload)
@router.get("", status_code=status.HTTP_200_OK, response_model=List[EmployeeBase], dependencies=[Depends(RoleChecker(["owner", "manager"]))])
def get_employee(
    current_user: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service)):
    employee = service.get_employee(current_user)
    return employee
