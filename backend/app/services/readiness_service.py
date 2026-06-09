"""Career readiness service — gathers user data and computes the readiness score."""
from __future__ import annotations

from prisma import Prisma

from app.ai import readiness_engine
from app.ai.data import get_profile
from app.ai.matching import coverage_ratio, match_skills
from app.schemas.readiness import ReadinessBreakdown, ReadinessResult


async def _resume_score(db: Prisma, user_id: str) -> float:
    resumes = await db.resume.find_many(
        where={"userId": user_id}, include={"scores": True}
    )
    best = 0.0
    for resume in resumes:
        for score in resume.scores or []:
            best = max(best, score.overallScore)
    return round(best, 2)


async def _skills_score(db: Prisma, user_id: str, track: str) -> float:
    user_skills_rows = await db.userskill.find_many(
        where={"userId": user_id}, include={"skill": True}
    )
    skill_names = [r.skill.name for r in user_skills_rows if r.skill]
    profile = get_profile(track)
    matched, _ = match_skills(skill_names, profile.core_skills)
    return round(coverage_ratio(matched, len(profile.core_skills)) * 100, 2)


async def _count_score(count: int, target: int) -> float:
    return round(min(1.0, count / target) * 100, 2)


async def compute(db: Prisma, user_id: str) -> ReadinessResult:
    profile_row = await db.profile.find_unique(where={"userId": user_id})
    track = (profile_row.careerTrack if profile_row else None) or "SOFTWARE_ENGINEERING"

    resume_score = await _resume_score(db, user_id)
    skills_score = await _skills_score(db, user_id, track)

    cert_count = await db.certification.count(where={"userId": user_id})
    project_count = await db.project.count(where={"userId": user_id})
    certifications_score = await _count_score(cert_count, 3)
    projects_score = await _count_score(project_count, 4)

    analytics = await db.analytics.find_unique(where={"userId": user_id})
    interview_score = round(analytics.avgInterviewScore if analytics else 0.0, 2)

    result = readiness_engine.calculate(
        resume_score=resume_score,
        skills_score=skills_score,
        certifications_score=certifications_score,
        projects_score=projects_score,
        interview_score=interview_score,
    )

    # Persist a snapshot.
    await db.readinessscore.create(
        data={
            "userId": user_id,
            "resumeScore": resume_score,
            "skillsScore": skills_score,
            "certificationsScore": certifications_score,
            "projectsScore": projects_score,
            "interviewScore": interview_score,
            "overallScore": result["overall_score"],
            "level": result["level"],
        }
    )
    if analytics:
        await db.analytics.update(
            where={"userId": user_id},
            data={"lastReadinessScore": result["overall_score"]},
        )

    return ReadinessResult(
        overall_score=result["overall_score"],
        level=result["level"],
        breakdown=ReadinessBreakdown(**result["breakdown"]),
        summary=result["summary"],
    )
