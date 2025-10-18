from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import JSONResponse
from passlib.context import CryptContext

from app.core.config import settings

# Note:
# The secure flag on cookies ensures they're only sent over encrypted HTTPS connections.
# For local development (HTTP) set it to False.
is_prod = settings.ENVIRONMENT == "production"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def set_auth_cookie(subject: str | Any, expires_delta: timedelta) -> JSONResponse:
    access_token = create_access_token(subject, expires_delta)
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=access_token,
        httponly=True,
        max_age=3600,
        expires=3600,
        samesite="lax",
        secure=is_prod,
        domain=None,
    )
    return response


def delete_auth_cookie() -> JSONResponse:
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME,
        path="/",
        domain=None,
        httponly=True,
        samesite="lax",
        secure=is_prod,
    )
    return response


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


GITHUB_OAUTH_CONFIG = {
    "name": "github",
    "client_id": settings.GITHUB_CLIENT_ID,
    "client_secret": settings.GITHUB_CLIENT_SECRET,
    "access_token_url": "https://github.com/login/oauth/access_token",
    "authorize_url": "https://github.com/login/oauth/authorize",
    "api_base_url": "https://api.github.com/",
    "client_kwargs": {"scope": "user:email"},
}


def create_oauth() -> OAuth:
    oauth = OAuth()
    oauth.register(**GITHUB_OAUTH_CONFIG)
    return oauth


oauth = create_oauth()
