"""Resume Analyzer — ATS, completeness, formatting, content & skills scoring.

All scores are 0–100 and explainable. The analyzer is deterministic and pure
(no I/O), which makes it straightforward to unit-test.
"""
from __future__ import annotations

import re

from app.ai.data import EXPECTED_SECTIONS, get_profile
from app.ai.matching import coverage_ratio, match_skills

ACTION_VERBS = {
    "built", "designed", "developed", "implemented", "led", "created",
    "optimized", "improved", "managed", "launched", "automated", "delivered",
    "architected", "reduced", "increased", "deployed", "analyzed",
}


def _section_present(content: dict, key: str) -> bool:
    value = content.get(key)
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return len(value) > 0
    return bool(value)


def _completeness(content: dict) -> tuple[float, list[str]]:
    present = [s for s in EXPECTED_SECTIONS if _section_present(content, s)]
    missing = [s for s in EXPECTED_SECTIONS if not _section_present(content, s)]
    score = round(100 * len(present) / len(EXPECTED_SECTIONS), 2)
    return score, missing


def _resume_text(content: dict) -> str:
    parts: list[str] = [content.get("summary", "")]
    for exp in content.get("experience", []) or []:
        parts.extend(exp.get("bullets", []) or [])
        parts.append(exp.get("role", ""))
    for proj in content.get("projects", []) or []:
        parts.append(proj.get("description", ""))
    parts.extend(content.get("achievements", []) or [])
    return " ".join(p for p in parts if p)


def _content_quality(content: dict) -> tuple[float, list[str]]:
    text = _resume_text(content)
    suggestions: list[str] = []
    if not text.strip():
        return 25.0, ["Add a professional summary and quantified experience bullets."]

    words = re.findall(r"[A-Za-z']+", text.lower())
    word_count = len(words)

    # 1) action-verb usage
    verb_hits = sum(1 for w in words if w in ACTION_VERBS)
    verb_score = min(1.0, verb_hits / 6)

    # 2) quantified achievements (numbers / %)
    has_numbers = len(re.findall(r"\d+%?|\$\d+", text))
    number_score = min(1.0, has_numbers / 4)

    # 3) summary length
    summary = content.get("summary", "")
    summary_score = min(1.0, len(summary.split()) / 40)

    if verb_hits < 3:
        suggestions.append("Use more strong action verbs (built, led, optimized...).")
    if has_numbers < 2:
        suggestions.append("Quantify impact with metrics (e.g. 'reduced load time by 30%').")
    if len(summary.split()) < 25:
        suggestions.append("Expand your professional summary to 2–3 impactful sentences.")
    if word_count < 120:
        suggestions.append("Add more detail to your experience and projects.")

    score = round(100 * (0.4 * verb_score + 0.35 * number_score + 0.25 * summary_score), 2)
    return score, suggestions


def _formatting(content: dict) -> tuple[float, list[str]]:
    suggestions: list[str] = []
    score = 100.0

    pi = content.get("personal_info", {}) or {}
    if not pi.get("email"):
        score -= 15
        suggestions.append("Add a contact email.")
    if not pi.get("phone"):
        score -= 10
        suggestions.append("Add a phone number.")
    if not (pi.get("linkedin") or pi.get("github")):
        score -= 10
        suggestions.append("Add a LinkedIn or GitHub link.")

    # Bullet hygiene: experience entries should have 2–5 concise bullets.
    for exp in content.get("experience", []) or []:
        bullets = exp.get("bullets", []) or []
        if len(bullets) > 6:
            score -= 5
            suggestions.append("Keep experience entries to 3–5 focused bullets.")
            break
        for b in bullets:
            if len(b.split()) > 35:
                score -= 5
                suggestions.append("Shorten overly long bullet points for readability.")
                break

    return round(max(score, 0), 2), suggestions


def _ats(content: dict, missing_sections: list[str], skills_coverage: float) -> tuple[float, list[str]]:
    suggestions: list[str] = []
    score = 100.0

    # ATS parsers rely on standard sections and clear contact info.
    critical = {"experience", "education", "skills"}
    missing_critical = critical.intersection(missing_sections)
    score -= 12 * len(missing_critical)
    for sec in missing_critical:
        suggestions.append(f"Add a '{sec}' section — ATS systems expect it.")

    pi = content.get("personal_info", {}) or {}
    if not pi.get("email"):
        score -= 10

    # Keyword/skill coverage strongly affects ATS ranking.
    score -= (1 - skills_coverage) * 30

    if skills_coverage < 0.6:
        suggestions.append("Include more role-relevant keywords/skills for ATS matching.")

    return round(max(min(score, 100), 0), 2), suggestions


def analyze(content: dict, target_track: str) -> dict:
    """Run the full analysis and return a structured result dict."""
    profile = get_profile(target_track)

    completeness_score, missing_sections = _completeness(content)
    content_score, content_sugg = _content_quality(content)
    formatting_score, fmt_sugg = _formatting(content)

    user_skills = list(content.get("skills", []) or [])
    matched, missing = match_skills(user_skills, profile.core_skills)
    skills_coverage = coverage_ratio(matched, len(profile.core_skills))

    ats_score, ats_sugg = _ats(content, missing_sections, skills_coverage)

    overall = round(
        0.30 * ats_score
        + 0.25 * content_score
        + 0.20 * completeness_score
        + 0.15 * formatting_score
        + 0.10 * (skills_coverage * 100),
        2,
    )

    suggestions = []
    for category, items, severity in [
        ("ATS", ats_sugg, "high"),
        ("Content", content_sugg, "medium"),
        ("Formatting", fmt_sugg, "low"),
    ]:
        for msg in items:
            suggestions.append({"category": category, "message": msg, "severity": severity})

    return {
        "ats_score": ats_score,
        "content_score": content_score,
        "formatting_score": formatting_score,
        "completeness_score": completeness_score,
        "skills_coverage": round(skills_coverage * 100, 2),
        "overall_score": overall,
        "missing_sections": missing_sections,
        "missing_skills": missing[:12],
        "matched_skills": matched,
        "suggestions": suggestions,
    }
