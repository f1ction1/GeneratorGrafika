from fastapi import FastAPI, Depends
from db import engine, Base, get_db
from sqlalchemy.orm import Session

# Import model modules so their classes are defined and mappers can be configured.
import models.User
import models.Employer
import models.Employee

from schemas.auth import RegisterRequest, TokenResponse
from services.auth import register_user

app = FastAPI(title="User Service API")
Base.metadata.create_all(bind=engine)

@app.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user(db, req)
    return {"access_token": token}

@app.get("/")
def root():
    return {"Hello": "World"}