from pydantic import BaseModel, EmailStr, validator, root_validator
from password_validator import PasswordValidator
import re

# pwd_schema = PasswordValidator() \
#     .min(8) \
#     .has().uppercase() \
#     .has().lowercase() \
#     .has().digits() \
#     .has().symbols()

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    password_confirm: str
    role:str

    @validator("first_name", "last_name")
    def validate_name(cls, v: str) -> str:
        if not v.isalpha():
            raise ValueError("Name must contain only letters")

        if v != v.capitalize():
            raise ValueError("Name must start with a capital letter and the rest must be lowercase")

        return v
    
    # @validator("password")
    # def password_validation(cls, v):
    #     if not pwd_schema.validate(v):
    #         raise ValueError("Password does not meet complexity requirements")
    #     return v
    @validator("password")
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v
    
    @validator("password_confirm")
    def passwords_match(cls, v: str, values) -> str:
        pwd = values.get("password")
        if pwd is not None and v != pwd:
            raise ValueError("Passwords do not match")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str

class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    

