"""Interview answer evaluator (heuristic).

Scores a free-text answer against expected keywords for the question, plus a
small bonus for answer depth (structure & length). Designed to be swapped for
an LLM-based evaluator via the provider interface without changing services.
"""
from __future__ import annotations

import re

from app.ai.matching import normalize


def _tokenize(text: str) -> set[str]:
    return {normalize(w) for w in re.findall(r"[A-Za-z][A-Za-z+.#]*", text.lower())}


def evaluate_answer(answer: str, keywords: list[str]) -> tuple[float, str]:
    """Return (score 0–100, feedback)."""
    answer = (answer or "").strip()
    if not answer:
        return 0.0, "No answer provided."

    words = answer.split()
    tokens = _tokenize(answer)
    norm_keywords = [normalize(k) for k in keywords] if keywords else []

    # Keyword coverage (primary signal)
    if norm_keywords:
        hits = sum(1 for k in norm_keywords if any(k in t or t in k for t in tokens))
        keyword_score = hits / len(norm_keywords)
    else:
        keyword_score = 0.5  # no rubric → neutral baseline

    # Depth signal: reward structured, sufficiently detailed answers.
    depth_score = min(1.0, len(words) / 60)

    score = round(100 * (0.7 * keyword_score + 0.3 * depth_score), 2)

    if score >= 80:
        feedback = "Strong answer — covers the key concepts with good depth."
    elif score >= 55:
        feedback = "Good answer. Add concrete examples and a few missing key terms."
    elif score >= 30:
        feedback = "Partial answer. Address more of the core concepts and add detail."
    else:
        feedback = "Needs work. Study the topic and structure your answer (e.g. STAR method)."

    return score, feedback


def evaluate_attempt(answers: list[dict]) -> dict:
    """answers: list of {question_id, score, keywords_missed}. Aggregate to a result."""
    if not answers:
        return {"score": 0.0, "improvement_areas": []}

    total = round(sum(a["score"] for a in answers) / len(answers), 2)

    improvement_areas: list[str] = []
    weak = [a for a in answers if a["score"] < 60]
    if weak:
        improvement_areas.append(
            f"Review {len(weak)} topic(s) where your answers scored below 60."
        )
    if total < 70:
        improvement_areas.append("Practice structuring answers using the STAR method.")
        improvement_areas.append("Include concrete examples and quantified outcomes.")

    return {"score": total, "improvement_areas": improvement_areas}
