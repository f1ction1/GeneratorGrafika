from fastapi import FastAPI
from db import engine, Base
from api.routers import employer, auth
from api.routers import user

app = FastAPI(title="User Service API")
Base.metadata.create_all(bind=engine)

# register auth routes under /auth
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(employer.router)
app.include_router(user.router)

@app.get("/")
def root():
    return {"Hello": "World"}

