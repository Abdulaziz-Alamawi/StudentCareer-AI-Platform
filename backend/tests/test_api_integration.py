"""Integration tests for the API surface.

These verify routing, OpenAPI generation, and the auth guard WITHOUT requiring a
live database. We deliberately avoid the lifespan context manager (so no startup
DB connection is attempted) and override the ``get_db`` dependency so the auth
guard can run in isolation. Endpoints that require a real database are exercised
in CI where a PostgreSQL service is provisioned (see .github/workflows/ci.yml).
"""
from __future__ import annotations

import pytest

try:
    # Importing app requires the generated Prisma client. If it isn't generated
    # (e.g. fresh checkout before `prisma generate`), skip these tests cleanly.
    from fastapi.testclient import TestClient

    from app.core.database import get_db
    from app.main import app

    _APP_AVAILABLE = True
except Exception:  # pragma: no cover - environment without generated client
    _APP_AVAILABLE = False

pytestmark = pytest.mark.skipif(
    not _APP_AVAILABLE, reason="Prisma client not generated; run `prisma generate`"
)


@pytest.fixture()
def client():
    # Plain TestClient (no context manager) => lifespan/DB connect is NOT run.
    # Override get_db so the auth dependency resolves without a real connection.
    app.dependency_overrides[get_db] = lambda: None
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["version"]


def test_openapi_schema_generates(client):
    resp = client.get("/openapi.json")
    assert resp.status_code == 200
    paths = resp.json()["paths"]
    # Spot-check that key endpoints are registered.
    assert "/api/v1/auth/register" in paths
    assert "/api/v1/resumes" in paths
    assert "/api/v1/analysis/resume" in paths
    assert "/api/v1/dashboard" in paths


def test_protected_route_requires_auth(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401


def test_register_validation_error(client):
    # Missing required fields -> 422 (validation runs before any DB access).
    resp = client.post("/api/v1/auth/register", json={"email": "bad"})
    assert resp.status_code == 422
