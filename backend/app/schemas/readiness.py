"""Career readiness schemas."""
from __future__ import annotations

from pydantic import BaseModel


class ReadinessBreakdown(BaseModel):
    resume_score: float
    skills_score: float
    certifications_score: float
    projects_score: float
    interview_score: float


class ReadinessResult(BaseModel):
    overall_score: float
    level: str
    breakdown: ReadinessBreakdown
    summary: str
