"""Skill gap analyzer routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from prisma.models import User

from app.core.deps import get_current_user
from app.schemas.skill import SkillGapRequest, SkillGapResult
from app.services import skill_service

router = APIRouter(prefix="/skills", tags=["Skill Gap"])


@router.post("/gap", response_model=SkillGapResult)
async def analyze_gap(
    payload: SkillGapRequest, _: User = Depends(get_current_user)
) -> SkillGapResult:
    return skill_service.analyze(payload)
