from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import Table, MetaData, insert, select
from db import engine, get_db
from sqlalchemy.orm import Session
import hashlib, secrets

router = APIRouter()

class RegisterUser(BaseModel):
    full_name: str | None = None  # moved to first
    email: EmailStr
    password: str
    password_repeat: str

def _hash_password(password: str) -> str:
    # PBKDF2-HMAC-SHA256 with random salt; store as salt$hexhash
    salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"{salt}${dk.hex()}"

@router.post("/register", status_code=201)
def register(user: RegisterUser, db: Session = Depends(get_db)):
    # check if passwords match
    if user.password != user.password_repeat:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    metadata = MetaData()
    try:
        users_tbl = Table("users", metadata, autoload_with=engine)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cannot reflect users table: {e}")

    # check if email exists
    stmt = select(users_tbl.c.id).where(users_tbl.c.email == user.email)
    existing = db.execute(stmt).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # determine password column name
    col_names = list(users_tbl.c.keys())
    if "password" in col_names:
        pwd_col = "password"
    elif "hashed_password" in col_names:
        pwd_col = "hashed_password"
    else:
        raise HTTPException(status_code=500, detail="No password column on users table (expected 'password' or 'hashed_password')")

    hashed = _hash_password(user.password)

    # build values dict: only email + password (plus default role if needed)
    values = {
        "email": user.email,
        pwd_col: hashed,
    }

    # handle full_name splitting
    if user.full_name:
        parts = user.full_name.strip().split(" ", 1)
        first = parts[0]
        last = parts[1] if len(parts) > 1 else ""
        if "first_name" in col_names:
            values["first_name"] = first
        if "last_name" in col_names:
            values["last_name"] = last

    # ensure role is set if the model requires it
    if "role" in col_names:
        values.setdefault("role", "user")

    # If first_name/last_name columns exist and are NOT NULL, provide empty string
    for name in ("first_name", "last_name"):
        if name in col_names:
            col = getattr(users_tbl.c, name)
            # only set if not provided (we don't accept these in registration)
            if name not in values and col is not None and getattr(col, "nullable", True) is False:
                values[name] = ""

    ins = insert(users_tbl).values(**values)
    try:
        returning_cols = []
        for col in ("id", "email", "role"):
            if col in col_names:
                returning_cols.append(getattr(users_tbl.c, col))
        result = db.execute(ins.returning(*returning_cols))
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    row = result.first()
    resp = {}
    if row is not None:
        # use mapping for compatibility across SQLAlchemy versions
        mapping = getattr(row, "_mapping", None)
        if mapping is not None:
            for key in mapping.keys():
                resp[key] = mapping[key]
        else:
            # fallback
            for idx, col in enumerate(returning_cols):
                resp[col.name] = row[idx]
    return resp
