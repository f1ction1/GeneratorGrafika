from pydantic import BaseModel
from typing import Optional

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    position: str
    employment_fraction: int
    employer_id: int
    # address: Optional[sstr] = None

class EmployeeCreate(EmployeeBase):
    pass

