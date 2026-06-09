"""Integration tests for the API.

These require the generated Prisma client (run `prisma generate`). If it's not
available (e.g. fresh checkout in CI before generation), the module is skipped.
"""
from __future__ import annotations

import pytest

try:
    from prisma.models import User  # noqa: F401  (triggers client-generated import)
    from fastapi.testclient import TestClient

    from app.main import app

    _CLIENT_AVAILABLE = True
except Exception:  # pragma: no cover - environment without generated client
    _CLIENT_AVAILABLE = False

pytestmark = pytest.mark.skipif(
    not _CLIENT_AVAILABLE, reason="Prisma client not generated"
)


@pytest.fixture(scope="module")
def client():
    # Use context manager so lifespan (DB connect) runs.
    with TestClient(app) as c:
        yield c


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_protected_route_requires_auth(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
