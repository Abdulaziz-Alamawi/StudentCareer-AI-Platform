"""Prisma client lifecycle management."""
from __future__ import annotations

import asyncio
import logging

from prisma import Prisma

from app.core.exceptions import DatabaseUnavailableError

logger = logging.getLogger("studentcareer.db")

# A single shared Prisma client for the application lifetime.
prisma = Prisma(auto_register=True)


async def connect_db() -> bool:
    """Connect the shared Prisma client.

    Returns True on success. Never raises during application startup so that
    health checks remain reachable even if the database is briefly unavailable;
    per-request access via ``get_db`` will surface connection problems instead.
    """
    if prisma.is_connected():
        return True
    try:
        await asyncio.wait_for(prisma.connect(), timeout=3.0)
        logger.info("Database connection established.")
        return True
    except Exception as exc:  # pragma: no cover - depends on runtime DB
        logger.warning("Database not reachable at startup: %s", exc)
        return False


async def disconnect_db() -> None:
    if prisma.is_connected():
        await prisma.disconnect()


async def get_db() -> Prisma:
    """FastAPI dependency that returns the connected Prisma client.

    Connects lazily on first use with a short timeout. Raises a clear 503 if the
    database is unreachable instead of hanging or returning an opaque 500.
    """
    if not prisma.is_connected():
        try:
            await asyncio.wait_for(prisma.connect(), timeout=5.0)
        except Exception as exc:
            logger.error("Database connection failed: %s", exc)
            raise DatabaseUnavailableError() from exc
    return prisma
