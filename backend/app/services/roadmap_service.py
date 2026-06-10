"""Career roadmap service — generates and persists roadmaps."""
from __future__ import annotations

from prisma import Prisma
from prisma.fields import Json

from app.ai import roadmap_generator
from app.schemas.roadmap import RoadmapRequest, RoadmapResult


async def generate(db: Prisma, user_id: str, payload: RoadmapRequest) -> RoadmapResult:
    result = roadmap_generator.generate(
        payload.career_track.value, payload.current_skills, payload.interests
    )

    # Persist each section as a CareerRoadmap row for progress tracking.
    for section in result["sections"]:
        await db.careerroadmap.create(
            data={
                "userId": user_id,
                "track": payload.career_track.value,
                "kind": section["kind"],
                "title": section["title"],
                "steps": Json(section["steps"]),
            }
        )

    return RoadmapResult(**result)
