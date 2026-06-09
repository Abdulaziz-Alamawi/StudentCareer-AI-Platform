"""Skill Gap Analyzer — compares a user's skills against a track profile."""
from __future__ import annotations

from app.ai.data import get_profile
from app.ai.matching import coverage_ratio, match_skills


def analyze(track: str, current_skills: list[str]) -> dict:
    profile = get_profile(track)

    matched, missing = match_skills(current_skills, profile.core_skills)
    coverage = coverage_ratio(matched, len(profile.core_skills))

    # Recommend tools the user likely doesn't have, prioritized by the gap.
    matched_tools, missing_tools = match_skills(
        current_skills, [t.lower() for t in profile.tools]
    )
    recommended_technologies = [
        t for t in profile.tools if t.lower() in missing_tools
    ][:5]

    # Fewer covered skills → recommend more certifications/projects.
    cert_count = 3 if coverage < 0.5 else (2 if coverage < 0.8 else 1)
    project_count = 3 if coverage < 0.6 else 2

    return {
        "track": profile.label,
        "coverage": round(coverage * 100, 2),
        "matched_skills": matched,
        "missing_skills": missing,
        "recommended_technologies": recommended_technologies,
        "recommended_certifications": profile.certifications[:cert_count],
        "recommended_projects": profile.project_ideas[:project_count],
    }
