"""
Report schemas.
"""
from __future__ import annotations

from pydantic import BaseModel


class ReportRequest(BaseModel):
    interview_id: int | None = None
    date_range: str | None = None  # e.g., "last_30_days", "all_time"
