from pydantic import BaseModel
from typing import Optional

class EmployerBase(BaseModel):
    name: str
    address: Optional[str] = None

class EmployerCreate(EmployerBase):
    pass

