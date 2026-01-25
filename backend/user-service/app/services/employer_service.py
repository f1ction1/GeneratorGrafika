from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models
from schemas.employer import EmployerCreate, EmployerBase, EmployerUpdate

class EmployerService:
    def __init__(self, db: Session):
        self.db = db

    def create_employer(self, user: models.User, data: EmployerCreate):       
        if user.employer_id is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already belongs to an employer")
        if user.role != "owner":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only owners can create employers",
            )
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

    def get_employer(self, user: models.User):
        employer = self.db.query(models.Employer).filter(models.Employer.id == user.employer_id).first()
        if not employer:
            raise HTTPException(status_code=404, detail='Employer is not found for the given user')
        
        return EmployerBase(name=employer.name, address=employer.address)

    def update_employer(self, user: models.User, data: EmployerUpdate):
        if user.role != "owner":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only owners can create employers",
            )
        employer = self.db.query(models.Employer).filter(models.Employer.id == user.employer_id).first()
        if not employer:
            raise HTTPException(status_code=404, detail='Employer not found')
        if employer.owner_id != user.id:
            raise HTTPException(status_code=403, detail='Only owner can update employer')
        updated = False
        if data.name is not None and data.name != employer.name:
            employer.name = data.name
            updated = True
        if data.address is not None and data.address != employer.address:
            employer.address = data.address
            updated = True
        if not updated:
            raise HTTPException(status_code=400, detail='No fields to update')
        self.db.commit()
        self.db.refresh(employer)
        return EmployerBase(name=employer.name, address=employer.address)