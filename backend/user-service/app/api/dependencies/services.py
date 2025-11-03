from fastapi import Depends
from sqlalchemy.orm import Session
from db import get_db
from services.employer_service import EmployerService

def get_employer_service(db: Session = Depends(get_db)) -> EmployerService:
    return EmployerService(db)