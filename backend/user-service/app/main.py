from fastapi import FastAPI
from db import engine, Base
from api.routers import employer

app = FastAPI(title="User Service API")
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"Hello": "World"}

app.include_router(employer.router)