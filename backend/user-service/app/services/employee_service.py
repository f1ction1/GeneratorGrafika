from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models
from schemas.employee import EmployeeCreate, EmployeeBase, EmployeeUpdate, EmployeeDelete

class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def create_employee(self, user: models.User, data: EmployeeCreate):       
        employee = models.Employee(
            first_name=data.first_name,
            last_name=data.last_name,
            position=data.position,
            employment_fraction=data.employment_fraction,
            employer_id=user.employer_id
        )
        self.db.add(employee)
        self.db.commit()

    # show all employees from current user
    def get_employee(self, user: models.User):
        employees = self.db.query(models.Employee).filter(models.Employee.employer_id == user.employer_id).all()
        if not employees:
            raise HTTPException(status_code=404, detail='Employees is not found for the given user')
        
        return [
            EmployeeBase(
                id=e.id,
                first_name=e.first_name,
                last_name=e.last_name,
                position=e.position,
                employment_fraction=e.employment_fraction,
                employer_id=e.employer_id
            )
            for e in employees
        ]

    def update_employee(self, user: models.User, data: EmployeeUpdate):
        employee = self.db.query(models.Employee).filter(models.Employee.id == data.id).first()
        if not employee:
            raise HTTPException(status_code=404, detail='Employee is not found by the given id')
        if employee.employer_id != user.employer_id:
            raise HTTPException(status_code=403, detail='Only owner can update employee')
        updated = False
        if data.first_name is not None and data.first_name != employee.first_name:
            employee.first_name = data.first_name
            updated = True
        if data.last_name is not None and data.last_name != employee.last_name:
            employee.last_name = data.last_name
            updated = True
        if data.position is not None and data.position != employee.position:
            employee.position = data.position
            updated = True
        if data.employment_fraction and data.employment_fraction != employee.employment_fraction:
            employee.employment_fraction = data.employment_fraction
            updated = True
        if not updated:
            raise HTTPException(status_code=400, detail='No fields to update')
        self.db.commit()
        self.db.refresh(employee)
        return EmployeeBase(id=employee.id,
            first_name=employee.first_name, 
            last_name=employee.last_name, 
            position=employee.position, 
            employment_fraction=employee.employment_fraction, 
            employer_id=user.employer_id)

    def delete_employee(self, user: models.User, data: EmployeeDelete):
        employee = self.db.query(models.Employee).filter(models.Employee.id == data.id).first()
        if not employee:
            raise HTTPException(status_code=404, detail='Employee is not found by the given id')
        if employee.employer_id != user.employer_id:
            raise HTTPException(status_code=403, detail='Only owner can update employee')
        self.db.delete(employee)
        self.db.commit()
        return {"message": "delete successfully"}
