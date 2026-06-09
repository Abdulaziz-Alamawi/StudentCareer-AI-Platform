"""Skill gap service."""
from __future__ import annotations

from app.ai import skill_gap
from app.schemas.skill import SkillGapRequest, SkillGapResult


def analyze(payload: SkillGapRequest) -> SkillGapResult:
    result = skill_gap.analyze(payload.career_track.value, payload.current_skills)
    return SkillGapResult(**result)
