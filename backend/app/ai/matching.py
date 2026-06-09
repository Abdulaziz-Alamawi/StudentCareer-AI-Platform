"""Reusable skill-matching using TF-IDF + cosine similarity (scikit-learn).

We treat each skill string as a short document, build a character + word n-gram
TF-IDF space, and match a candidate skill to a required skill when their cosine
similarity exceeds a threshold. This tolerates spelling/format variations
(e.g. "node js" ↔ "node.js", "ML" ↔ "machine learning" via aliases).
"""
from __future__ import annotations

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Common aliases normalized before matching.
ALIASES = {
    "ml": "machine learning",
    "dl": "deep learning",
    "ai": "artificial intelligence",
    "js": "javascript",
    "ts": "typescript",
    "k8s": "kubernetes",
    "nodejs": "node.js",
    "node js": "node.js",
    "postgres": "postgresql",
    "oop": "object-oriented programming",
    "ds": "data structures",
    "tf": "tensorflow",
}

MATCH_THRESHOLD = 0.55


def normalize(skill: str) -> str:
    s = skill.strip().lower()
    return ALIASES.get(s, s)


def match_skills(
    candidate_skills: list[str],
    required_skills: list[str],
    threshold: float = MATCH_THRESHOLD,
) -> tuple[list[str], list[str]]:
    """Return (matched_required, missing_required).

    A required skill is 'matched' if any candidate skill has cosine similarity
    above `threshold` (exact normalized matches always count).
    """
    required = [normalize(s) for s in required_skills if s.strip()]
    candidates = [normalize(s) for s in candidate_skills if s.strip()]

    if not required:
        return [], []
    if not candidates:
        return [], list(required)

    cand_set = set(candidates)
    matched: list[str] = []
    missing: list[str] = []

    # Vectorize all unique strings together so they share a vocabulary.
    corpus = list(dict.fromkeys(required + candidates))
    vectorizer = TfidfVectorizer(
        analyzer="char_wb", ngram_range=(2, 4), min_df=1
    )
    matrix = vectorizer.fit_transform(corpus)
    index = {term: i for i, term in enumerate(corpus)}

    cand_indices = [index[c] for c in cand_set]
    cand_matrix = matrix[cand_indices]

    for req in required:
        if req in cand_set:
            matched.append(req)
            continue
        req_vec = matrix[index[req]]
        sims = cosine_similarity(req_vec, cand_matrix)
        if sims.size and float(np.max(sims)) >= threshold:
            matched.append(req)
        else:
            missing.append(req)

    return matched, missing


def coverage_ratio(matched: list[str], total_required: int) -> float:
    if total_required == 0:
        return 1.0
    return round(len(matched) / total_required, 4)
