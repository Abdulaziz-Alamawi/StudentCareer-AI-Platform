"""Reusable FastAPI dependencies (auth / current user)."""
from __future__ import annotations

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from prisma.models import User

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import UnauthorizedError
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login", auto_error=False
)


async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db=Depends(get_db),
) -> User:
    """Resolve and return the authenticated user, or raise 401."""
    if not token:
        raise UnauthorizedError("Missing authentication token")

    user_id = decode_access_token(token)
    if not user_id:
        raise UnauthorizedError("Invalid or expired token")

    user = await db.user.find_unique(where={"id": user_id})
    if not user or not user.isActive:
        raise UnauthorizedError("User not found or inactive")
    return user
