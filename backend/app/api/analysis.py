"""AI resume analysis routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.analysis import AnalysisRequest, AnalysisResult
from app.services import analysis_service

router = APIRouter(prefix="/analysis", tags=["Resume Analysis"])


@router.post("/resume", response_model=AnalysisResult)
async def analyze_resume(
    payload: AnalysisRequest,
    user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> AnalysisResult:
    return await analysis_service.analyze(db, user.id, payload)
