"""Custom exceptions and centralized handlers for consistent error responses."""
from __future__ import annotations

import httpx
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from prisma.errors import PrismaError


class AppError(Exception):
    """Base application error with an HTTP status and message."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Not authenticated"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


class ForbiddenError(AppError):
    def __init__(self, message: str = "You do not have access to this resource"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class ConflictError(AppError):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message, status.HTTP_409_CONFLICT)


class DatabaseUnavailableError(AppError):
    def __init__(
        self,
        message: str = (
            "Database is unavailable. Start PostgreSQL (e.g. docker compose up db) "
            "and ensure DATABASE_URL is correct."
        ),
    ):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE)


def _error_body(message: str, details: object | None = None) -> dict:
    body: dict = {"success": False, "error": {"message": message}}
    if details is not None:
        body["error"]["details"] = details
    return body


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _app_error_handler(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code, content=_error_body(exc.message)
        )

    @app.exception_handler(RequestValidationError)
    async def _validation_handler(
        _: Request, exc: RequestValidationError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_error_body("Validation failed", exc.errors()),
        )

    @app.exception_handler(DatabaseUnavailableError)
    async def _db_unavailable_handler(
        _: Request, exc: DatabaseUnavailableError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code, content=_error_body(exc.message)
        )

    @app.exception_handler(httpx.ConnectError)
    async def _connect_error_handler(_: Request, __: httpx.ConnectError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=_error_body(DatabaseUnavailableError().message),
        )

    @app.exception_handler(PrismaError)
    async def _prisma_error_handler(_: Request, exc: PrismaError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=_error_body(f"Database error: {exc}"),
        )

    @app.exception_handler(Exception)
    async def _unhandled_handler(_: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_body("Internal server error"),
        )
