from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    password_confirm: str
    role:str

class TokenResponse(BaseModel):
    access_token: str
    
