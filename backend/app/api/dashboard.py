"""Dashboard aggregation routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from prisma.models import User

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.dashboard import DashboardData
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardData)
async def get_dashboard(
    user: User = Depends(get_current_user), db=Depends(get_db)
) -> DashboardData:
    return await dashboard_service.get_dashboard(db, user.id)
