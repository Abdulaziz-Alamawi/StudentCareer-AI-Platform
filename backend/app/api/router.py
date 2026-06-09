"""Top-level API router aggregating all domain routers."""
from __future__ import annotations

from fastapi import APIRouter

from app.api import (
    analysis,
    auth,
    dashboard,
    interview,
    readiness,
    resume,
    roadmap,
    skills,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(resume.router)
api_router.include_router(analysis.router)
api_router.include_router(interview.router)
api_router.include_router(skills.router)
api_router.include_router(roadmap.router)
api_router.include_router(readiness.router)
api_router.include_router(dashboard.router)
