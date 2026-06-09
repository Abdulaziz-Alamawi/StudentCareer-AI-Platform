"""Dashboard service — aggregates analytics across all modules."""
from __future__ import annotations

from prisma import Prisma

from app.schemas.dashboard import (
    DashboardData,
    InterviewAnalyticsSummary,
    RecommendationItem,
    ResumeAnalyticsSummary,
)
from app.services import readiness_service


async def get_dashboard(db: Prisma, user_id: str) -> DashboardData:
    readiness = await readiness_service.compute(db, user_id)

    # Resume analytics
    resumes = await db.resume.find_many(
        where={"userId": user_id}, include={"scores": True}
    )
    best_ats = 0.0
    latest_overall = 0.0
    latest_ts = None
    for resume in resumes:
        for score in resume.scores or []:
            best_ats = max(best_ats, score.atsScore)
            if latest_ts is None or score.createdAt > latest_ts:
                latest_ts = score.createdAt
                latest_overall = score.overallScore

    resume_analytics = ResumeAnalyticsSummary(
        total_resumes=len(resumes),
        best_ats_score=round(best_ats, 2),
        latest_overall_score=round(latest_overall, 2),
    )

    # Interview analytics
    attempts = await db.interviewattempt.find_many(
        where={"userId": user_id, "completedAt": {"not": None}}
    )
    scores = [a.score for a in attempts]
    interview_analytics = InterviewAnalyticsSummary(
        attempts=len(attempts),
        average_score=round(sum(scores) / len(scores), 2) if scores else 0.0,
        best_score=round(max(scores), 2) if scores else 0.0,
    )

    # Roadmap progress (average across stored roadmaps)
    roadmaps = await db.careerroadmap.find_many(where={"userId": user_id})
    roadmap_progress = (
        round(sum(r.progress for r in roadmaps) / len(roadmaps), 2) if roadmaps else 0.0
    )

    # Recommendations
    rec_rows = await db.recommendation.find_many(
        where={"userId": user_id, "isCompleted": False},
        order={"priority": "asc"},
        take=8,
    )
    recommendations = [
        RecommendationItem(
            type=r.type, title=r.title, description=r.description, priority=r.priority
        )
        for r in rec_rows
    ]

    return DashboardData(
        readiness=readiness,
        resume_analytics=resume_analytics,
        interview_analytics=interview_analytics,
        skill_coverage=readiness.breakdown.skills_score,
        roadmap_progress=roadmap_progress,
        recommendations=recommendations,
    )
