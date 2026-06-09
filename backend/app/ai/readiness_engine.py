"""Career Readiness Engine — weighted multi-factor 0–100 score.

Inputs are five sub-scores (each 0–100). The weighted sum yields a single
readiness score that maps to a human-readable level.
"""
from __future__ import annotations

WEIGHTS = {
    "resume": 0.25,
    "skills": 0.25,
    "certifications": 0.15,
    "projects": 0.15,
    "interview": 0.20,
}


def _level(score: float) -> str:
    if score >= 85:
        return "HIGHLY_COMPETITIVE"
    if score >= 70:
        return "JOB_READY"
    if score >= 45:
        return "DEVELOPING"
    return "BEGINNER"


def _summary(level: str, score: float) -> str:
    messages = {
        "HIGHLY_COMPETITIVE": (
            f"Outstanding — at {score}/100 you are highly competitive. "
            "Focus on standing out and targeting top roles."
        ),
        "JOB_READY": (
            f"Great progress — at {score}/100 you are job-ready. "
            "Polish weak areas and start applying."
        ),
        "DEVELOPING": (
            f"You're developing well ({score}/100). Strengthen your skills and "
            "build more projects to reach job-ready."
        ),
        "BEGINNER": (
            f"You're at the beginning ({score}/100). Follow your roadmap to build "
            "foundational skills and your first projects."
        ),
    }
    return messages[level]


def calculate(
    resume_score: float,
    skills_score: float,
    certifications_score: float,
    projects_score: float,
    interview_score: float,
) -> dict:
    breakdown = {
        "resume": resume_score,
        "skills": skills_score,
        "certifications": certifications_score,
        "projects": projects_score,
        "interview": interview_score,
    }
    overall = round(sum(WEIGHTS[k] * v for k, v in breakdown.items()), 2)
    level = _level(overall)
    return {
        "overall_score": overall,
        "level": level,
        "breakdown": {
            "resume_score": resume_score,
            "skills_score": skills_score,
            "certifications_score": certifications_score,
            "projects_score": projects_score,
            "interview_score": interview_score,
        },
        "summary": _summary(level, overall),
    }
