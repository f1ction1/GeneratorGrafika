from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models
from schemas.employee import EmployeeCreate, EmployeeBase

class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def create_employee(self, user: models.User, data: EmployeeCreate):       
        # if user.employee_id is not None:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already belongs to an employee")

        employee = models.Employee(
            first_name=data.first_name,
            last_name=data.last_name,
            position=data.position,
            employment_fraction=data.employment_fraction,
            employer_id=user.employer_id
        )
        self.db.add(employee)
        #self.db.flush()  # get id employee (without commit)
        #owner.employee_id -> employee.id
        #employer.employee_id = employee.id
        self.db.commit()

    # show only first employee from current user
    def get_employee(self, user: models.User):
        employee = self.db.query(models.Employee).filter(models.Employee.employer_id == user.employer_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail='Employees is not found for the given user')
        
        return EmployeeBase(
            first_name=employee.first_name, 
            last_name=employee.last_name, 
            position=employee.position, 
            employment_fraction=employee.employment_fraction, 
            employer_id=user.employer_id
        )

    # show all employees from current user
    def get_employees(self, user: models.User):
        employees = self.db.query(models.Employee).filter(models.Employee.employer_id == user.employer_id).all()
        if not employees:
            raise HTTPException(status_code=404, detail='Employees is not found for the given user')
        
        return [
            EmployeeBase(
                first_name=e.first_name,
                last_name=e.last_name,
                position=e.position,
                employment_fraction=e.employment_fraction,
                employer_id=e.employer_id
            )
            for e in employees
        ]