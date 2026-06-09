"""Shared schema primitives."""
from __future__ import annotations

from enum import Enum
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class CareerTrack(str, Enum):
    SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING"
    ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE"
    CLOUD_COMPUTING = "CLOUD_COMPUTING"
    IT_INFRASTRUCTURE = "IT_INFRASTRUCTURE"
    DATA_SCIENCE = "DATA_SCIENCE"
    BUSINESS_ANALYSIS = "BUSINESS_ANALYSIS"


class Difficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class QuestionType(str, Enum):
    TECHNICAL = "TECHNICAL"
    BEHAVIORAL = "BEHAVIORAL"
    SCENARIO = "SCENARIO"


class ResumeTemplate(str, Enum):
    MODERN = "MODERN"
    ATS_FRIENDLY = "ATS_FRIENDLY"
    PROFESSIONAL = "PROFESSIONAL"


class ReadinessLevel(str, Enum):
    BEGINNER = "BEGINNER"
    DEVELOPING = "DEVELOPING"
    JOB_READY = "JOB_READY"
    HIGHLY_COMPETITIVE = "HIGHLY_COMPETITIVE"


class APIResponse(BaseModel, Generic[T]):
    """Standard success envelope."""

    success: bool = True
    data: T | None = None
    message: str | None = None
