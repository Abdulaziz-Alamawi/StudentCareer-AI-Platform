"""Resume service — CRUD, duplication, and ownership enforcement."""
from __future__ import annotations

import json

from prisma import Prisma
from prisma.fields import Json
from prisma.models import Resume

from app.core.exceptions import ForbiddenError, NotFoundError
from app.schemas.resume import ResumeCreate, ResumeOut, ResumeUpdate


def _to_out(resume: Resume) -> ResumeOut:
    content = resume.content
    if isinstance(content, str):
        content = json.loads(content)
    return ResumeOut(
        id=resume.id,
        user_id=resume.userId,
        title=resume.title,
        template=resume.template,
        is_primary=resume.isPrimary,
        content=content or {},
        created_at=resume.createdAt,
        updated_at=resume.updatedAt,
    )


async def _get_owned(db: Prisma, user_id: str, resume_id: str) -> Resume:
    resume = await db.resume.find_unique(where={"id": resume_id})
    if not resume:
        raise NotFoundError("Resume not found.")
    if resume.userId != user_id:
        raise ForbiddenError("You do not own this resume.")
    return resume


async def create(db: Prisma, user_id: str, payload: ResumeCreate) -> ResumeOut:
    resume = await db.resume.create(
        data={
            "userId": user_id,
            "title": payload.title,
            "template": payload.template.value,
            "content": Json(payload.content.model_dump()),
        }
    )
    await db.analytics.update(
        where={"userId": user_id}, data={"resumesCreated": {"increment": 1}}
    )
    return _to_out(resume)


async def list_for_user(db: Prisma, user_id: str) -> list[ResumeOut]:
    resumes = await db.resume.find_many(
        where={"userId": user_id}, order={"updatedAt": "desc"}
    )
    return [_to_out(r) for r in resumes]


async def get(db: Prisma, user_id: str, resume_id: str) -> ResumeOut:
    return _to_out(await _get_owned(db, user_id, resume_id))


async def update(db: Prisma, user_id: str, resume_id: str, payload: ResumeUpdate) -> ResumeOut:
    await _get_owned(db, user_id, resume_id)
    data: dict = {}
    if payload.title is not None:
        data["title"] = payload.title
    if payload.template is not None:
        data["template"] = payload.template.value
    if payload.is_primary is not None:
        data["isPrimary"] = payload.is_primary
    if payload.content is not None:
        data["content"] = Json(payload.content.model_dump())

    resume = await db.resume.update(where={"id": resume_id}, data=data)
    return _to_out(resume)


async def duplicate(db: Prisma, user_id: str, resume_id: str) -> ResumeOut:
    original = await _get_owned(db, user_id, resume_id)
    content = original.content
    if isinstance(content, str):
        content = json.loads(content)
    copy = await db.resume.create(
        data={
            "userId": user_id,
            "title": f"{original.title} (Copy)",
            "template": original.template,
            "content": Json(content or {}),
        }
    )
    return _to_out(copy)


async def delete(db: Prisma, user_id: str, resume_id: str) -> None:
    await _get_owned(db, user_id, resume_id)
    await db.resume.delete(where={"id": resume_id})
