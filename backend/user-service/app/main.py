from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel # for data validation
from db import engine, Base

app = FastAPI(title="User Service API")
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"Hello": "World"}