from fastapi import Depends
from sqlalchemy.orm import Session
from db import get_db
from services.employer_service import EmployerService
from services.employee_service import EmployeeService

def get_employer_service(db: Session = Depends(get_db)) -> EmployerService:
    return EmployerService(db)

def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    return EmployeeService(db)

def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    return EmployeeService(db)