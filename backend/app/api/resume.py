"""Resume CRUD routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, status
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.resume import ResumeCreate, ResumeOut, ResumeUpdate
from app.services import resume_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("", response_model=ResumeOut, status_code=201)
async def create_resume(
    payload: ResumeCreate,
    user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> ResumeOut:
    return await resume_service.create(db, user.id, payload)


@router.get("", response_model=list[ResumeOut])
async def list_resumes(
    user: User = Depends(get_current_user), db=Depends(get_db)
) -> list[ResumeOut]:
    return await resume_service.list_for_user(db, user.id)


@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(
    resume_id: str, user: User = Depends(get_current_user), db=Depends(get_db)
) -> ResumeOut:
    return await resume_service.get(db, user.id, resume_id)


@router.put("/{resume_id}", response_model=ResumeOut)
async def update_resume(
    resume_id: str,
    payload: ResumeUpdate,
    user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> ResumeOut:
    return await resume_service.update(db, user.id, resume_id, payload)


@router.post("/{resume_id}/duplicate", response_model=ResumeOut, status_code=201)
async def duplicate_resume(
    resume_id: str, user: User = Depends(get_current_user), db=Depends(get_db)
) -> ResumeOut:
    return await resume_service.duplicate(db, user.id, resume_id)


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str, user: User = Depends(get_current_user), db=Depends(get_db)
):
    """Delete a resume. Returns 204 No Content on success."""
    await resume_service.delete(db, user.id, resume_id)
    return None
