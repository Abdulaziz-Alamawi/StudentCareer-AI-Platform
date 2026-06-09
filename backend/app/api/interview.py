"""AI interview simulator routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.interview import (
    InterviewResult,
    InterviewSubmit,
    QuestionOut,
    StartInterviewRequest,
)
from app.services import interview_service

router = APIRouter(prefix="/interview", tags=["Interview Simulator"])


@router.post("/questions", response_model=list[QuestionOut])
async def get_questions(
    payload: StartInterviewRequest,
    _: User = Depends(get_current_user),
    db=Depends(get_db),
) -> list[QuestionOut]:
    return await interview_service.get_questions(db, payload)


@router.post("/attempts", response_model=InterviewResult)
async def submit_attempt(
    payload: InterviewSubmit,
    user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> InterviewResult:
    return await interview_service.submit(db, user.id, payload)
