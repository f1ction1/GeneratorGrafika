from pydantic import BaseModel, ConfigDict
from typing import Optional

class EmployeeBase(BaseModel):
    id: Optional[int] = None
    first_name: str
    last_name: str
    position: str
    employment_fraction: float
    # employer_id: int
    # address: Optional[sstr] = None

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    position: str
    employment_fraction: float

class EmployeeUpdate(BaseModel):
    id: int 
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    position: Optional[str] = None
    employment_fraction: Optional[float] = None

    model_config = ConfigDict(
        json_schema_extra = {
            "example": {
                "id": 0,
                "first_name": "",
                "last_name": "",
                "position": "",
                "employment_fraction": 0,
            }
        }
    )

class EmployeeDelete(BaseModel):
    id: int 

    # model_config = ConfigDict(
    #     json_schema_extra = {
    #         "example": {"id": 0}
    #     }
    # )