from pydantic import BaseModel
from typing import Optional

class EmployerBase(BaseModel):
    name: str
    address: Optional[str] = None

class EmployerCreate(EmployerBase):
    pass

class EmployerUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None

