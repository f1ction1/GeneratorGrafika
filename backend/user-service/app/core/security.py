import os
import hmac
import hashlib
import base64
import json

SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-change-me")

def hash_password(password: str) -> str:
    return hmac.new(SECRET_KEY.encode(), password.encode(), hashlib.sha256).hexdigest()

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
