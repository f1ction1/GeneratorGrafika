from pydantic import BaseModel, ConfigDict, validator
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
    
    @validator("first_name", "last_name")
    def validate_name(cls, v: str) -> str:
        if not v.isalpha():
            raise ValueError("Name must contain only letters")

        if v != v.capitalize():
            raise ValueError("Name must start with a capital letter and the rest must be lowercase")

        return v
    
    @validator("employment_fraction")
    def validate_fraction(cls, v):
        if not (0 <= v <= 1):
            raise ValueError("Employment fraction must be between 0 and 1")
        return v

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