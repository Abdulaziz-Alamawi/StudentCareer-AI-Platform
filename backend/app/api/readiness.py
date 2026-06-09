"""Career readiness routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.readiness import ReadinessResult
from app.services import readiness_service

router = APIRouter(prefix="/readiness", tags=["Career Readiness"])


@router.get("", response_model=ReadinessResult)
async def get_readiness(
    user: User = Depends(get_current_user), db=Depends(get_db)
) -> ReadinessResult:
    return await readiness_service.compute(db, user.id)
