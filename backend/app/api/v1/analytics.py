"""
Analytics router.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.analytics import DashboardStats, RecentActivity
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    service = AnalyticsService(db)
    return service.get_dashboard_stats(current_user.id)


@router.get("/recent", response_model=list[RecentActivity])
def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[dict]:
    service = AnalyticsService(db)
    return service.get_recent_interviews(current_user.id, limit=5)
