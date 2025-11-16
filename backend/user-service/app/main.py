from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine, Base
from api.routers import employer, auth, employee

app = FastAPI(title="User Service API")

# Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adres frontendu
    allow_credentials=True,
    allow_methods=["*"],  # Pozwala na wszystkie metody HTTP
    allow_headers=["*"],  # Pozwala na wszystkie headery
)

Base.metadata.create_all(bind=engine)

# register auth routes under /auth
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(employer.router)
app.include_router(employee.router)

@app.get("/")
def root():
    return {"Hello": "World"}

