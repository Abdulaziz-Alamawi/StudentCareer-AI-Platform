"""Resume schemas — structured content model used by the builder & analyzer."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import ResumeTemplate


class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""


class EducationItem(BaseModel):
    institution: str = ""
    degree: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""


class ExperienceItem(BaseModel):
    company: str = ""
    role: str = ""
    start_date: str = ""
    end_date: str = ""
    location: str = ""
    bullets: list[str] = []


class ProjectItem(BaseModel):
    name: str = ""
    description: str = ""
    tech_stack: list[str] = []
    url: str = ""


class CertificationItem(BaseModel):
    name: str = ""
    issuer: str = ""
    date: str = ""


class LanguageItem(BaseModel):
    name: str = ""
    proficiency: str = ""


class ResumeContent(BaseModel):
    """The full structured resume document."""

    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    summary: str = ""
    education: list[EducationItem] = []
    experience: list[ExperienceItem] = []
    projects: list[ProjectItem] = []
    skills: list[str] = []
    certifications: list[CertificationItem] = []
    languages: list[LanguageItem] = []
    achievements: list[str] = []


class ResumeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    template: ResumeTemplate = ResumeTemplate.MODERN
    content: ResumeContent = Field(default_factory=ResumeContent)


class ResumeUpdate(BaseModel):
    title: str | None = None
    template: ResumeTemplate | None = None
    content: ResumeContent | None = None
    is_primary: bool | None = None


class ResumeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    title: str
    template: str
    is_primary: bool
    content: dict
    created_at: datetime
    updated_at: datetime
