"""StudentCareer AI Platform — FastAPI application entrypoint."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.core.exceptions import register_exception_handlers


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    yield
    await disconnect_db()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=(
            "AI-powered career development & employability assessment platform. "
            "Build resumes, analyze them, simulate interviews, measure career "
            "readiness, find skill gaps, and generate personalized roadmaps."
        ),
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/", tags=["Health"])
    async def root() -> dict:
        return {
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs": "/docs",
            "status": "ok",
        }

    @app.get("/health", tags=["Health"])
    async def health() -> dict:
        return {"status": "healthy"}

    return app


app = create_app()
