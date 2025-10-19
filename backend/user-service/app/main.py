from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from db import engine, Base, get_db
from sqlalchemy.orm import Session

app = FastAPI(title="User Service API")

# load models and create tables on startup (avoids side-effects at import time)
@app.on_event("startup")
def on_startup():
    import importlib.util
    import sys
    from pathlib import Path

    _models_dir = Path(__file__).parent / "models"
    if _models_dir.exists():
        for _p in sorted(_models_dir.glob("*.py")):
            if _p.name == "__init__.py" or _p.stem.startswith("_"):
                continue
            spec = importlib.util.spec_from_file_location(f"app.models.{_p.stem}", str(_p))
            module = importlib.util.module_from_spec(spec)
            sys.modules[spec.name] = module
            spec.loader.exec_module(module)

    # create tables after models are registered
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"Hello": "World"}

from routes.auth import router as auth_router  # new file
app.include_router(auth_router)