"""Career roadmap schemas."""
from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.common import CareerTrack


class RoadmapRequest(BaseModel):
    major: str = ""
    career_track: CareerTrack
    interests: list[str] = Field(default_factory=list)
    current_skills: list[str] = Field(default_factory=list)


class RoadmapStep(BaseModel):
    order: int
    title: str
    description: str
    duration_weeks: int
    resources: list[str] = []


class RoadmapSection(BaseModel):
    kind: str  # LEARNING | CERTIFICATION | PROJECT | CAREER
    title: str
    steps: list[RoadmapStep]


class RoadmapResult(BaseModel):
    track: str
    sections: list[RoadmapSection]
