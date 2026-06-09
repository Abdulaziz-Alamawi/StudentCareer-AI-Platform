"""Validation tests for Pydantic schemas."""
from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.auth import UserRegister
from app.schemas.interview import InterviewSubmit
from app.schemas.resume import ResumeContent, ResumeCreate
from app.schemas.skill import SkillGapRequest


def test_user_register_rejects_short_password():
    with pytest.raises(ValidationError):
        UserRegister(email="a@b.com", password="short", full_name="Test User")


def test_user_register_rejects_bad_email():
    with pytest.raises(ValidationError):
        UserRegister(email="not-an-email", password="longenough123", full_name="Test")


def test_resume_create_defaults():
    resume = ResumeCreate(title="My Resume")
    assert resume.template.value == "MODERN"
    assert isinstance(resume.content, ResumeContent)


def test_interview_submit_requires_answers():
    with pytest.raises(ValidationError):
        InterviewSubmit(track="SOFTWARE_ENGINEERING", difficulty="MEDIUM", answers=[])


def test_skill_gap_request_valid():
    req = SkillGapRequest(career_track="DATA_SCIENCE", current_skills=["python"])
    assert req.career_track.value == "DATA_SCIENCE"
