from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from db import get_db
from models.User import User
import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import hmac
import hashlib
import base64
import json
from datetime import datetime, timedelta

SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-change-me")
ALGORITHM = "HS256"
bearer_scheme = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id") # type: ignore
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return user

def hash_password(password: str) -> str:
    return hmac.new(SECRET_KEY.encode(), password.encode(), hashlib.sha256).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    # porównanie odporne na timing attacks
    return hmac.compare_digest(hash_password(password), hashed)

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def create_jwt(payload: dict) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b = _base64url_encode(json.dumps(header, separators=(",", ":")).encode())
    payload_b = _base64url_encode(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{header_b}.{payload_b}".encode()
    signature = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
    signature_b = _base64url_encode(signature)
    return f"{header_b}.{payload_b}.{signature_b}"

def create_reset_token(user_id: int, expires_minutes: int = 30) -> str:
    exp_ts = int((datetime.utcnow() + timedelta(minutes=expires_minutes)).timestamp())
    payload = {"id": str(user_id), "type": "password_reset", "exp": exp_ts}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def _decode_legacy_reset_token(token: str) -> dict | None:
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        return None
    pad = lambda segment: segment + "=" * (-len(segment) % 4)
    signing_input = f"{header_b64}.{payload_b64}".encode()
    try:
        expected = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
        actual = base64.urlsafe_b64decode(pad(signature_b64))
    except Exception:
        return None
    if not hmac.compare_digest(expected, actual):
        return None
    try:
        payload_raw = base64.urlsafe_b64decode(pad(payload_b64)).decode()
        payload = json.loads(payload_raw)
    except Exception:
        return None
    exp_value = payload.get("exp")
    if exp_value is not None and int(exp_value) < int(datetime.utcnow().timestamp()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    return payload

def verify_reset_token(token: str) -> int:
    cleaned_token = token.strip()
    if not cleaned_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")
    try:
        data = jwt.decode(cleaned_token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        data = _decode_legacy_reset_token(cleaned_token)
        if not data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    if data.get("type") != "password_reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token type")
    user_id = data.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload")
    return int(user_id)
