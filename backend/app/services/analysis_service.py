"""Resume analysis service — runs the AI engine and persists scores."""
from __future__ import annotations

import json

from prisma import Prisma

from app.ai.provider import get_provider
from app.core.exceptions import ForbiddenError, NotFoundError, AppError
from app.schemas.analysis import AnalysisRequest, AnalysisResult, Suggestion


async def analyze(db: Prisma, user_id: str, payload: AnalysisRequest) -> AnalysisResult:
    content: dict | None = None

    if payload.resume_id:
        resume = await db.resume.find_unique(where={"id": payload.resume_id})
        if not resume:
            raise NotFoundError("Resume not found.")
        if resume.userId != user_id:
            raise ForbiddenError("You do not own this resume.")
        content = resume.content if isinstance(resume.content, dict) else json.loads(resume.content)
    elif payload.content is not None:
        content = payload.content.model_dump()
    else:
        raise AppError("Provide either resume_id or inline content to analyze.")

    provider = get_provider()
    result = provider.analyze_resume(content, payload.target_track.value)

    if payload.resume_id:
        await db.resumescore.create(
            data={
                "resumeId": payload.resume_id,
                "atsScore": result["ats_score"],
                "contentScore": result["content_score"],
                "formattingScore": result["formatting_score"],
                "completenessScore": result["completeness_score"],
                "skillsCoverage": result["skills_coverage"],
                "overallScore": result["overall_score"],
                "missingSections": result["missing_sections"],
                "missingSkills": result["missing_skills"],
                "suggestions": json.dumps(result["suggestions"]),
            }
        )
    await db.analytics.update(
        where={"userId": user_id}, data={"analysesRun": {"increment": 1}}
    )

    return AnalysisResult(
        ats_score=result["ats_score"],
        content_score=result["content_score"],
        formatting_score=result["formatting_score"],
        completeness_score=result["completeness_score"],
        skills_coverage=result["skills_coverage"],
        overall_score=result["overall_score"],
        missing_sections=result["missing_sections"],
        missing_skills=result["missing_skills"],
        matched_skills=result["matched_skills"],
        suggestions=[Suggestion(**s) for s in result["suggestions"]],
    )
