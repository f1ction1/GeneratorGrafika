from pydantic import BaseModel, validator
from typing import Optional
import re

class EmployerBase(BaseModel):
    name: str
    address: Optional[str] = None
    
    @validator("name")
    def validate_name(cls, v: str):
        """
        Company name rules:
        - 2–100 characters
        - Letters, digits, spaces, dot, dash, apostrophe, ampersand
        - Must contain at least one letter or digit
        """
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Employer name must be at least 2 characters long")
        if len(v) > 100:
            raise ValueError("Employer name must be no longer than 100 characters")

        # Allowed characters pattern
        if not re.match(r"^[A-Za-z0-9 .&'\-]+$", v):
            raise ValueError("Employer name contains invalid characters")

        # Must contain at least one alphanumeric character
        if not re.search(r"[A-Za-z0-9]", v):
            raise ValueError("Employer name must contain at least one letter or digit")

        return v

    @validator("address")
    def validate_address(cls, v: Optional[str]):
        """
        Address rules:
        - If provided → at least 5 characters
        - Remove blank values like "  "
        """
        if v is None:
            return v

        v = v.strip()

        if len(v) < 5:
            raise ValueError("Address must be at least 5 characters long")

        # Allowed chars pattern for a typical address
        if not re.match(r"^[A-Za-z0-9 ,.\-]+$", v):
            raise ValueError("Address contains invalid characters")

        return v

class EmployerCreate(EmployerBase):
    pass

class EmployerUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None

    @validator("name")
    def validate_name(cls, v):
        if v is None:
            return v

        v = v.strip()
        if len(v) < 2:
            raise ValueError("Employer name must be at least 2 characters long")
        if len(v) > 100:
            raise ValueError("Employer name must be no longer than 100 characters")
        if not re.match(r"^[A-Za-z0-9 .&'\-]+$", v):
            raise ValueError("Employer name contains invalid characters")
        if not re.search(r"[A-Za-z0-9]", v):
            raise ValueError("Employer name must contain at least one letter or digit")

        return v

    @validator("address")
    def validate_address(cls, v):
        if v is None:
            return v

        v = v.strip()
        if len(v) < 5:
            raise ValueError("Address must be at least 5 characters long")
        if not re.match(r"^[A-Za-z0-9 ,.\-]+$", v):
            raise ValueError("Address contains invalid characters")

        return v

