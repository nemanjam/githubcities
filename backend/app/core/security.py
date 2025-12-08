import logging
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlparse

import jwt
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import JSONResponse, Response
from passlib.context import CryptContext

from app.core.config import settings
from app.utils import is_prod

# Note:
# The secure flag on cookies ensures they're only sent over encrypted HTTPS connections.
# For local development (HTTP) set it to False.

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def set_auth_cookie(
    subject: str | Any, expires_delta: timedelta, response: Response
) -> Response:
    # Cookie expiration and JWT expiration match
    # Note: cookie expiration must be in seconds
    expires_in_seconds = int(expires_delta.total_seconds())
    access_token = create_access_token(subject, expires_delta)

    # Dev defaults
    samesite = "lax"
    domain = None

    # Prod overrides
    if is_prod:
        samesite = "none"
        # Note: important for cross-site cookies in prod to succeed
        # api-site.rpi.example.com and site.rpi.example.com
        parsed = urlparse(settings.SITE_URL)
        domain = parsed.hostname  # full domain

        # if it has subdomains whitelist cookie for "1 level less" subdomain, rpi.example.com
        host_segments = domain.split(".")
        if len(host_segments) > 2:
            domain = ".".join(host_segments[1:])  # remove the first segment (head)

    logger.info(f"domain: {domain}")

    response.set_cookie(
        key=settings.AUTH_COOKIE,
        value=access_token,
        httponly=True,
        max_age=expires_in_seconds,
        expires=expires_in_seconds,
        samesite=samesite,
        secure=is_prod,
        domain=domain,
    )
    return response


def delete_auth_cookie() -> JSONResponse:
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(
        key=settings.AUTH_COOKIE,
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


# ------------------------ GitHub OAuth ---------------------------


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
