from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models
from schemas.employer import EmployerCreate, EmployerBase

class EmployerService:
    def __init__(self, db: Session):
        self.db = db

    def create_employer(self, user: models.User, data: EmployerCreate):       
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

    def get_employer(self, id: int):
        employer = self.db.query(models.Employer).filter(models.Employer.id == id).first()
        if not employer:
            raise HTTPException(status_code=404, detail='Employer is not found')
        
        return EmployerBase(name=employer.name, address=employer.address)