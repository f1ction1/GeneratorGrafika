from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine, Base
import logging

from api.routers import employer, auth, employee, user, schedule
from core.logging_config import setup_logging, get_logger
from core.middleware import LoggingMiddleware, RequestContextMiddleware
from core.settings import settings

#
setup_logging(
    log_level="INFO",  
    log_to_file=True,
    log_to_console=True,
    json_logs=True
)

logger = get_logger(__name__)

app = FastAPI(title="User Service API")

logger.info("Starting User Service API...")

app.add_middleware(LoggingMiddleware)
app.add_middleware(RequestContextMiddleware)

# Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],  # Adres frontendu
    allow_credentials=True,
    allow_methods=["*"],  # Pozwala na wszystkie metody HTTP
    allow_headers=["*"],  # Pozwala na wszystkie headery
)

logger.info("Middleware configured")

Base.metadata.create_all(bind=engine)
logger.info("Database tables created/verified")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(employer.router)
app.include_router(user.router)
app.include_router(employee.router)
app.include_router(schedule.router)

logger.info("All routers registered")
logger.info("User Service API ready to accept requests")
app.include_router(schedule.router)

