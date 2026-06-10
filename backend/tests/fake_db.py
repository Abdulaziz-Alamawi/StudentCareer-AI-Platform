"""An in-memory fake of the Prisma client for deterministic E2E API tests.

It implements just enough of the Prisma query surface used by the service layer
so the full HTTP request/response cycle (routing, schemas, serialization,
business logic) can be validated without a running PostgreSQL instance.

Records are stored as attribute-accessible objects using the same camelCase
attribute names that the generated Prisma models expose.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from prisma.fields import Json


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Record:
    """Attribute-accessible record (mirrors a Prisma model instance)."""

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)


def _unwrap(value):
    """Convert a prisma Json wrapper to its plain Python value (as real Prisma reads it)."""
    if isinstance(value, Json):
        return value.data
    return value


class FakeModel:
    def __init__(self, store: list[Record], defaults: dict, db: "FakeDB"):
        self._store = store
        self._defaults = defaults
        self._db = db

    # ---- helpers ----
    def _matches(self, rec: Record, where: dict) -> bool:
        for key, val in where.items():
            attr = getattr(rec, key, None)
            if isinstance(val, dict):
                if "not" in val and attr == val["not"]:
                    return False
            elif attr != val:
                return False
        return True

    def _apply_include(self, rec: Record, include: dict | None) -> Record:
        if not include:
            return rec
        if include.get("scores"):
            rec.scores = [s for s in self._db.resumescore._store if s.resumeId == rec.id]
        if include.get("skill"):
            rec.skill = next(
                (s for s in self._db.skill._store if s.id == rec.skillId), None
            )
        return rec

    # ---- query API ----
    async def create(self, data: dict):
        record_data = {**self._defaults}
        for key, value in data.items():
            record_data[key] = _unwrap(value)
        record_data.setdefault("id", str(uuid.uuid4()))
        rec = Record(**record_data)
        self._store.append(rec)
        return rec

    async def find_unique(self, where: dict, include: dict | None = None):
        for rec in self._store:
            if self._matches(rec, where):
                return self._apply_include(rec, include)
        return None

    async def find_many(
        self, where: dict | None = None, order: dict | None = None,
        take: int | None = None, include: dict | None = None,
    ):
        results = [r for r in self._store if not where or self._matches(r, where)]
        if order:
            field, direction = next(iter(order.items()))
            results.sort(
                key=lambda r: getattr(r, field, 0) or 0, reverse=(direction == "desc")
            )
        if take is not None:
            results = results[:take]
        return [self._apply_include(r, include) for r in results]

    async def update(self, where: dict, data: dict):
        rec = await self.find_unique(where)
        if not rec:
            return None
        for key, value in data.items():
            if isinstance(value, dict) and "increment" in value:
                setattr(rec, key, (getattr(rec, key, 0) or 0) + value["increment"])
            else:
                setattr(rec, key, _unwrap(value))
        return rec

    async def delete(self, where: dict):
        rec = await self.find_unique(where)
        if rec:
            self._store.remove(rec)
        return rec

    async def count(self, where: dict | None = None) -> int:
        return len([r for r in self._store if not where or self._matches(r, where)])


class FakeDB:
    """Minimal in-memory stand-in for the Prisma client."""

    def __init__(self):
        self._users: list[Record] = []
        self._profiles: list[Record] = []
        self._analytics: list[Record] = []
        self._resumes: list[Record] = []
        self._resumescores: list[Record] = []
        self._questions: list[Record] = []
        self._attempts: list[Record] = []
        self._answers: list[Record] = []
        self._roadmaps: list[Record] = []
        self._recommendations: list[Record] = []
        self._readiness: list[Record] = []
        self._userskills: list[Record] = []
        self._skills: list[Record] = []
        self._certifications: list[Record] = []
        self._projects: list[Record] = []

        self.user = FakeModel(
            self._users,
            {"role": "STUDENT", "isActive": True, "createdAt": _now(), "updatedAt": _now()},
            self,
        )
        self.profile = FakeModel(
            self._profiles,
            {
                "headline": None, "bio": None, "major": None, "university": None,
                "graduationYear": None, "careerTrack": None, "location": None,
                "phone": None, "linkedinUrl": None, "githubUrl": None,
                "websiteUrl": None, "avatarUrl": None, "interests": [],
            },
            self,
        )
        self.analytics = FakeModel(
            self._analytics,
            {
                "resumesCreated": 0, "analysesRun": 0, "interviewsTaken": 0,
                "avgInterviewScore": 0.0, "lastReadinessScore": 0.0,
                "profileViews": 0, "updatedAt": _now(),
            },
            self,
        )
        self.resume = FakeModel(
            self._resumes,
            {"isPrimary": False, "content": {}, "createdAt": _now(), "updatedAt": _now()},
            self,
        )
        self.resumescore = FakeModel(self._resumescores, {"createdAt": _now()}, self)
        self.interviewquestion = FakeModel(self._questions, {"keywords": []}, self)
        self.interviewattempt = FakeModel(
            self._attempts,
            {"score": 0.0, "totalQuestions": 0, "improvementAreas": [],
             "completedAt": None, "createdAt": _now()},
            self,
        )
        self.interviewanswer = FakeModel(self._answers, {"score": 0.0}, self)
        self.careerroadmap = FakeModel(self._roadmaps, {"progress": 0.0, "createdAt": _now()}, self)
        self.recommendation = FakeModel(self._recommendations, {"priority": 3}, self)
        self.readinessscore = FakeModel(self._readiness, {"createdAt": _now()}, self)
        self.userskill = FakeModel(self._userskills, {"level": "BEGINNER"}, self)
        self.skill = FakeModel(self._skills, {"demandScore": 0.5}, self)
        self.certification = FakeModel(self._certifications, {}, self)
        self.project = FakeModel(self._projects, {}, self)

    def seed_questions(self) -> None:
        for i in range(3):
            self._questions.append(
                Record(
                    id=f"q{i}", track="SOFTWARE_ENGINEERING", type="TECHNICAL",
                    difficulty="MEDIUM",
                    prompt=f"Explain concept {i}", keywords=["array", "memory", "access"],
                )
            )

    def is_connected(self) -> bool:
        return True
