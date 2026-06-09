"""Skill gap analyzer schemas."""
from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.common import CareerTrack


class SkillGapRequest(BaseModel):
    career_track: CareerTrack
    current_skills: list[str] = Field(default_factory=list)


class SkillGapResult(BaseModel):
    track: str
    coverage: float
    matched_skills: list[str]
    missing_skills: list[str]
    recommended_technologies: list[str]
    recommended_certifications: list[str]
    recommended_projects: list[str]
