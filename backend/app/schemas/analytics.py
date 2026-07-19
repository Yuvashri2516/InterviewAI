"""
Analytics schemas.
"""
from __future__ import annotations

from typing import Any
from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_interviews: int
    avg_score: float
    best_score: float
    questions_answered: int
    current_streak: int


class DataPoint(BaseModel):
    label: str
    value: float


class WeeklyProgress(BaseModel):
    data: list[DataPoint]


class MonthlyProgress(BaseModel):
    data: list[DataPoint]


class SkillAnalysis(BaseModel):
    strong_topics: list[str]
    weak_topics: list[str]
    skill_scores: dict[str, float]


class RecentActivity(BaseModel):
    id: int
    role: str
    score: float | None
    date: str
