"""Career roadmap generator routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.roadmap import RoadmapRequest, RoadmapResult
from app.services import roadmap_service

router = APIRouter(prefix="/roadmap", tags=["Career Roadmap"])


@router.post("/generate", response_model=RoadmapResult)
async def generate_roadmap(
    payload: RoadmapRequest,
    user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> RoadmapResult:
    return await roadmap_service.generate(db, user.id, payload)
