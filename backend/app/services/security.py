# backend/app/services/security.py
from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt, JWTError
from starlette.responses import Response
from ..config import get_settings

settings = get_settings()

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    """Creates a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def set_auth_cookie(response: Response, token: str):
    """Sets the HTTP-only, Secure, SameSite=Lax cookie for the JWT."""
    # Note: domain is often required for subdomains to share cookies (not needed here)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production", # Only send over HTTPS in production
        samesite="Lax",
        expires=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
