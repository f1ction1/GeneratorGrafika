from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from user_service import models

from user_service.schemas import employer

class EmployerService:
    def __init__(self, db: Session):
        self.db = db

    def create_employer(self, user: models.User, data: employer.EmployerCreate):       
        #only owner can create a company
        if user.role != "owner":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only users with role 'owner' can create an employer")

        if user.employer_id is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already belongs to an employer")

        employer = models.Employer(
            name=data.name,
            address=data.address,
            owner_id=user.id
        )
        self.db.add(employer)
        self.db.flush()  # get id employer (without commit)
        #owner.employer_id -> employer.id
        user.employer_id = employer.id
        self.db.commit()
        self.db.refresh(employer)
        return employer

    def delete_employer(self, employer: models.Employer):
        # у моделі cascade має видалятися users/employees
        self.db.delete(employer)
        self.db.commit()
        return True