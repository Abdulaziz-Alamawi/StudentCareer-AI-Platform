"""End-to-end API tests using an in-memory fake database.

These exercise the full HTTP cycle for every feature without requiring a live
PostgreSQL instance, validating routing, request/response schemas, JSON
serialization, auth, and service business logic.
"""
from __future__ import annotations

import pytest

try:
    from fastapi.testclient import TestClient

    from app.core.database import get_db
    from app.main import app
    from tests.fake_db import FakeDB

    _AVAILABLE = True
except Exception:  # pragma: no cover
    _AVAILABLE = False

pytestmark = pytest.mark.skipif(not _AVAILABLE, reason="Prisma client not generated")


@pytest.fixture()
def db():
    fake = FakeDB()
    fake.seed_questions()
    return fake


@pytest.fixture()
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def auth_headers(client) -> dict:
    resp = client.post(
        "/api/v1/auth/register",
        json={"email": "user@test.com", "password": "password123", "full_name": "Test User"},
    )
    assert resp.status_code == 201, resp.text
    token = resp.json()["token"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_and_login_flow(client):
    headers = auth_headers(client)
    # /me
    me = client.get("/api/v1/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == "user@test.com"
    # login json
    login = client.post(
        "/api/v1/auth/login/json",
        json={"email": "user@test.com", "password": "password123"},
    )
    assert login.status_code == 200
    assert login.json()["token"]["access_token"]
    # wrong password
    bad = client.post(
        "/api/v1/auth/login/json",
        json={"email": "user@test.com", "password": "wrongpass1"},
    )
    assert bad.status_code == 401


def test_profile_update(client):
    headers = auth_headers(client)
    resp = client.put(
        "/api/v1/auth/profile",
        headers=headers,
        json={"headline": "CS Student", "career_track": "DATA_SCIENCE", "major": "CS"},
    )
    assert resp.status_code == 200
    assert resp.json()["headline"] == "CS Student"
    assert resp.json()["career_track"] == "DATA_SCIENCE"


def test_resume_crud_and_duplicate(client):
    headers = auth_headers(client)
    # create
    created = client.post(
        "/api/v1/resumes",
        headers=headers,
        json={"title": "My Resume", "template": "MODERN",
              "content": {"summary": "Engineer", "skills": ["python"]}},
    )
    assert created.status_code == 201, created.text
    rid = created.json()["id"]
    assert created.json()["content"]["summary"] == "Engineer"
    # list
    listed = client.get("/api/v1/resumes", headers=headers)
    assert listed.status_code == 200 and len(listed.json()) == 1
    # get
    got = client.get(f"/api/v1/resumes/{rid}", headers=headers)
    assert got.status_code == 200
    # update
    updated = client.put(
        f"/api/v1/resumes/{rid}", headers=headers, json={"title": "Updated"}
    )
    assert updated.status_code == 200 and updated.json()["title"] == "Updated"
    # duplicate
    dup = client.post(f"/api/v1/resumes/{rid}/duplicate", headers=headers)
    assert dup.status_code == 201 and "(Copy)" in dup.json()["title"]
    # delete
    deleted = client.delete(f"/api/v1/resumes/{rid}", headers=headers)
    assert deleted.status_code == 204


def test_resume_analysis_inline(client):
    headers = auth_headers(client)
    resp = client.post(
        "/api/v1/analysis/resume",
        headers=headers,
        json={
            "content": {
                "personal_info": {"email": "a@b.com"},
                "summary": "Built scalable APIs reducing latency by 30%",
                "experience": [{"role": "Dev", "bullets": ["Built REST API", "Led team"]}],
                "skills": ["python", "sql", "git", "react"],
                "education": [{"degree": "BSc"}],
            },
            "target_track": "SOFTWARE_ENGINEERING",
        },
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert 0 <= body["overall_score"] <= 100
    assert 0 <= body["ats_score"] <= 100
    assert "matched_skills" in body
    assert isinstance(body["suggestions"], list)


def test_interview_flow(client):
    headers = auth_headers(client)
    # fetch questions
    qs = client.post(
        "/api/v1/interview/questions",
        headers=headers,
        json={"track": "SOFTWARE_ENGINEERING", "difficulty": "MEDIUM", "limit": 3},
    )
    assert qs.status_code == 200
    questions = qs.json()
    assert len(questions) == 3
    # submit answers
    submit = client.post(
        "/api/v1/interview/attempts",
        headers=headers,
        json={
            "track": "SOFTWARE_ENGINEERING",
            "difficulty": "MEDIUM",
            "answers": [
                {"question_id": q["id"], "answer": "Arrays use contiguous memory for O(1) access."}
                for q in questions
            ],
        },
    )
    assert submit.status_code == 200, submit.text
    result = submit.json()
    assert 0 <= result["score"] <= 100
    assert result["total_questions"] == 3
    assert len(result["per_answer"]) == 3


def test_skill_gap(client):
    headers = auth_headers(client)
    resp = client.post(
        "/api/v1/skills/gap",
        headers=headers,
        json={"career_track": "DATA_SCIENCE", "current_skills": ["python", "sql"]},
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert 0 <= body["coverage"] <= 100
    assert body["missing_skills"]
    assert body["recommended_certifications"]


def test_roadmap_generation(client):
    headers = auth_headers(client)
    resp = client.post(
        "/api/v1/roadmap/generate",
        headers=headers,
        json={
            "major": "CS",
            "career_track": "CLOUD_COMPUTING",
            "current_skills": ["linux"],
            "interests": ["devops"],
        },
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    kinds = {s["kind"] for s in body["sections"]}
    assert kinds == {"LEARNING", "CERTIFICATION", "PROJECT", "CAREER"}


def test_readiness_and_dashboard(client):
    headers = auth_headers(client)
    readiness = client.get("/api/v1/readiness", headers=headers)
    assert readiness.status_code == 200, readiness.text
    assert 0 <= readiness.json()["overall_score"] <= 100
    assert readiness.json()["level"] in {
        "BEGINNER", "DEVELOPING", "JOB_READY", "HIGHLY_COMPETITIVE"
    }

    dashboard = client.get("/api/v1/dashboard", headers=headers)
    assert dashboard.status_code == 200, dashboard.text
    body = dashboard.json()
    assert "readiness" in body
    assert "resume_analytics" in body
    assert "interview_analytics" in body
    assert isinstance(body["recommendations"], list)
