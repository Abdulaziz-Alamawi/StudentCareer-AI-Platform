"""Career Roadmap Generator — personalized learning/cert/project/career plans.

Combines the track profile with the user's existing skills so the learning
roadmap focuses on what's actually missing (data-driven), while certification,
project and career roadmaps follow curated progressions.
"""
from __future__ import annotations

from app.ai.data import get_profile
from app.ai.matching import match_skills


def _learning_section(track: str, current_skills: list[str]) -> dict:
    profile = get_profile(track)
    _, missing = match_skills(current_skills, profile.core_skills)
    focus = missing or profile.core_skills[:6]

    steps = []
    for i, skill in enumerate(focus[:8], start=1):
        steps.append(
            {
                "order": i,
                "title": f"Learn {skill.title()}",
                "description": f"Build solid fundamentals in {skill} for {profile.label}.",
                "duration_weeks": 2,
                "resources": [
                    f"Official docs / course for {skill}",
                    f"Hands-on mini-project using {skill}",
                ],
            }
        )
    return {"kind": "LEARNING", "title": "Learning Roadmap", "steps": steps}


def _certification_section(track: str) -> dict:
    profile = get_profile(track)
    steps = []
    for i, cert in enumerate(profile.certifications, start=1):
        steps.append(
            {
                "order": i,
                "title": cert,
                "description": "Prepare for and obtain this industry-recognized certification.",
                "duration_weeks": 6,
                "resources": ["Official exam guide", "Practice exams"],
            }
        )
    return {"kind": "CERTIFICATION", "title": "Certification Roadmap", "steps": steps}


def _project_section(track: str) -> dict:
    profile = get_profile(track)
    steps = []
    for i, idea in enumerate(profile.project_ideas, start=1):
        steps.append(
            {
                "order": i,
                "title": idea,
                "description": "Build, document, and publish this project to your portfolio.",
                "duration_weeks": 3,
                "resources": ["GitHub repository", "README + demo"],
            }
        )
    return {"kind": "PROJECT", "title": "Project Roadmap", "steps": steps}


def _career_section(track: str) -> dict:
    profile = get_profile(track)
    milestones = [
        ("Build foundations", "Master core skills and complete first projects.", 8),
        ("Earn a certification", "Validate your skills with a recognized credential.", 6),
        ("Internship / entry role", "Apply for internships and junior positions.", 8),
        (f"Junior {profile.label}", "Grow on the job and specialize.", 24),
    ]
    steps = [
        {
            "order": i,
            "title": title,
            "description": desc,
            "duration_weeks": weeks,
            "resources": [],
        }
        for i, (title, desc, weeks) in enumerate(milestones, start=1)
    ]
    return {"kind": "CAREER", "title": "Career Roadmap", "steps": steps}


def generate(track: str, current_skills: list[str], interests: list[str] | None = None) -> dict:
    profile = get_profile(track)
    return {
        "track": profile.label,
        "sections": [
            _learning_section(track, current_skills),
            _certification_section(track),
            _project_section(track),
            _career_section(track),
        ],
    }
