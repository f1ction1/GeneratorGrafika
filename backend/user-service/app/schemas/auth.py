from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    password_confirm: str

class TokenResponse(BaseModel):
    access_token: str
    
