"""Unit tests for the AI Engine (pure functions, no database required)."""
from __future__ import annotations

from app.ai import readiness_engine, resume_analyzer, skill_gap
from app.ai.interview_evaluator import evaluate_answer, evaluate_attempt
from app.ai.matching import coverage_ratio, match_skills, normalize


# ---------------- matching ----------------

def test_normalize_aliases():
    assert normalize("JS") == "javascript"
    assert normalize("ML") == "machine learning"
    assert normalize("Python") == "python"


def test_match_skills_exact_and_fuzzy():
    matched, missing = match_skills(
        ["python", "node js", "git"], ["python", "node.js", "docker"]
    )
    assert "python" in matched
    assert "node.js" in matched  # fuzzy/alias match
    assert "docker" in missing


def test_coverage_ratio():
    assert coverage_ratio(["a", "b"], 4) == 0.5
    assert coverage_ratio([], 0) == 1.0


# ---------------- resume analyzer ----------------

def _sample_resume() -> dict:
    return {
        "personal_info": {"email": "a@b.com", "phone": "123", "linkedin": "x"},
        "summary": "Software engineer who built and optimized scalable APIs reducing latency by 30%.",
        "education": [{"institution": "Uni", "degree": "BSc"}],
        "experience": [
            {"role": "Dev", "bullets": ["Built REST API", "Reduced load by 40%", "Led team"]}
        ],
        "projects": [{"name": "P", "description": "A project", "tech_stack": ["python"]}],
        "skills": ["python", "sql", "git", "react", "testing"],
        "certifications": [{"name": "AWS"}],
        "languages": [{"name": "English"}],
        "achievements": ["Won hackathon"],
    }


def test_resume_analysis_full_resume_scores_high():
    result = resume_analyzer.analyze(_sample_resume(), "SOFTWARE_ENGINEERING")
    assert 0 <= result["overall_score"] <= 100
    assert result["completeness_score"] == 100.0
    assert isinstance(result["suggestions"], list)
    assert result["matched_skills"]


def test_resume_analysis_empty_resume_flags_missing():
    result = resume_analyzer.analyze({}, "SOFTWARE_ENGINEERING")
    assert result["completeness_score"] < 100
    assert "experience" in result["missing_sections"]
    assert result["overall_score"] < result["completeness_score"] + 60


# ---------------- skill gap ----------------

def test_skill_gap_detects_missing():
    result = skill_gap.analyze("DATA_SCIENCE", ["python", "sql"])
    assert 0 <= result["coverage"] <= 100
    assert "python" in result["matched_skills"]
    assert result["missing_skills"]
    assert result["recommended_certifications"]


# ---------------- readiness ----------------

def test_readiness_levels():
    high = readiness_engine.calculate(90, 90, 90, 90, 90)
    assert high["level"] == "HIGHLY_COMPETITIVE"
    low = readiness_engine.calculate(10, 10, 0, 0, 0)
    assert low["level"] == "BEGINNER"
    assert 0 <= high["overall_score"] <= 100


# ---------------- interview evaluator ----------------

def test_evaluate_answer_keyword_coverage():
    strong, _ = evaluate_answer(
        "An array stores elements in contiguous memory with O(1) access, "
        "while a linked list uses nodes and pointers for fast insertion.",
        ["array", "linked list", "memory", "access", "insertion"],
    )
    weak, _ = evaluate_answer("I don't know.", ["array", "memory", "access"])
    assert strong > weak
    assert evaluate_answer("", ["x"])[0] == 0.0


def test_evaluate_attempt_aggregates():
    result = evaluate_attempt([{"question_id": "1", "score": 80}, {"question_id": "2", "score": 40}])
    assert result["score"] == 60.0
    assert result["improvement_areas"]
