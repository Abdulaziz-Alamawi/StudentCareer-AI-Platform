"""Resume analysis schemas."""
from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import CareerTrack
from app.schemas.resume import ResumeContent


class AnalysisRequest(BaseModel):
    """Analyze either a stored resume (by id) or an inline resume + target track."""

    resume_id: str | None = None
    content: ResumeContent | None = None
    target_track: CareerTrack = CareerTrack.SOFTWARE_ENGINEERING


class Suggestion(BaseModel):
    category: str
    message: str
    severity: str  # "low" | "medium" | "high"


class AnalysisResult(BaseModel):
    ats_score: float
    content_score: float
    formatting_score: float
    completeness_score: float
    skills_coverage: float
    overall_score: float
    missing_sections: list[str]
    missing_skills: list[str]
    matched_skills: list[str]
    suggestions: list[Suggestion]
