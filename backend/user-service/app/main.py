from fastapi import FastAPI
from db import engine, Base
from sqlalchemy.orm import Session

# Import model modules so their classes are defined and mappers can be configured.
import models.User
import models.Employer
import models.Employee

# import and register routers
from routes import auth as auth_routes

app = FastAPI(title="User Service API")
Base.metadata.create_all(bind=engine)

# register auth routes under /auth
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"Hello": "World"}