"""Dashboard aggregation schemas."""
from __future__ import annotations

from pydantic import BaseModel

from app.schemas.readiness import ReadinessResult


class ResumeAnalyticsSummary(BaseModel):
    total_resumes: int
    best_ats_score: float
    latest_overall_score: float


class InterviewAnalyticsSummary(BaseModel):
    attempts: int
    average_score: float
    best_score: float


class RecommendationItem(BaseModel):
    type: str
    title: str
    description: str
    priority: int


class DashboardData(BaseModel):
    readiness: ReadinessResult
    resume_analytics: ResumeAnalyticsSummary
    interview_analytics: InterviewAnalyticsSummary
    skill_coverage: float
    roadmap_progress: float
    recommendations: list[RecommendationItem]
