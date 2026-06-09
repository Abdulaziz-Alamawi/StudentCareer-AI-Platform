"""Interview simulator schemas."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import CareerTrack, Difficulty, QuestionType


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    track: str
    type: str
    difficulty: str
    prompt: str


class AnswerSubmission(BaseModel):
    question_id: str
    answer: str = Field(min_length=1)


class InterviewSubmit(BaseModel):
    track: CareerTrack
    difficulty: Difficulty
    answers: list[AnswerSubmission] = Field(min_length=1)


class AnswerFeedback(BaseModel):
    question_id: str
    score: float
    feedback: str


class InterviewResult(BaseModel):
    attempt_id: str
    score: float
    total_questions: int
    improvement_areas: list[str]
    per_answer: list[AnswerFeedback]


class StartInterviewRequest(BaseModel):
    track: CareerTrack
    difficulty: Difficulty = Difficulty.MEDIUM
    question_type: QuestionType | None = None
    limit: int = Field(default=5, ge=1, le=20)
