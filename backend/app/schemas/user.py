"""Profile schemas."""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from app.schemas.common import CareerTrack


class ProfileUpdate(BaseModel):
    headline: str | None = None
    bio: str | None = None
    major: str | None = None
    university: str | None = None
    graduation_year: int | None = None
    career_track: CareerTrack | None = None
    location: str | None = None
    phone: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    website_url: str | None = None
    interests: list[str] | None = None


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    headline: str | None = None
    bio: str | None = None
    major: str | None = None
    university: str | None = None
    graduation_year: int | None = None
    career_track: str | None = None
    location: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    website_url: str | None = None
    interests: list[str] = []
