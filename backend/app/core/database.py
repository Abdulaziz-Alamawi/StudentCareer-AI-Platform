"""Prisma client lifecycle management."""
from __future__ import annotations

from prisma import Prisma

# A single shared Prisma client for the application lifetime.
prisma = Prisma(auto_register=True)


async def connect_db() -> None:
    if not prisma.is_connected():
        await prisma.connect()


async def disconnect_db() -> None:
    if prisma.is_connected():
        await prisma.disconnect()


async def get_db() -> Prisma:
    """FastAPI dependency that yields the connected Prisma client."""
    if not prisma.is_connected():
        await prisma.connect()
    return prisma
