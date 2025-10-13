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