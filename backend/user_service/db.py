import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

Base = declarative_base()

URL_DATABASE = os.getenv("DATABASE_URL")


engine = create_engine(URL_DATABASE)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()