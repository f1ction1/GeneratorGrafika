How to get started?

pip install fastapi
pip install uvicorn

uvicorn - it's a server btw

uvocorn main:app --reload  - to start the server

-------------------------||----------------------------

The purpose of folders

api/ - Controllers (endpoints FastAPI)
core/ - Configurations (JWT, logs..)
models/ - SQLAlchemy models
schemas/ - validation schemas
services/ - business logic

You have to add user-service/.env file for email to work:

ZOHO_SMTP_HOST=smtp.zoho.eu
ZOHO_SMTP_PORT=587
ZOHO_SMTP_USER=no-reply@neatly.cc
ZOHO_SMTP_PASSWORD=tRcD6fRPhVDv
ZOHO_FROM_EMAIL=no-reply@neatly.cc
ZOHO_FROM_NAME=Schedule Generator
PASSWORD_RESET_URL=http://localhost:3000/reset-password