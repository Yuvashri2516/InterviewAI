"""
Analytics service.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.interview import Interview, Question


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_stats(self, user_id: int) -> dict:
        interviews = self.db.query(Interview).filter(Interview.user_id == user_id, Interview.status == "completed").all()
        
        total_interviews = len(interviews)
        scores = [inv.score for inv in interviews if inv.score is not None]
        avg_score = sum(scores) / len(scores) if scores else 0.0
        best_score = max(scores) if scores else 0.0
        
        # Total questions answered
        q_count = self.db.query(func.count(Question.id))\
            .join(Interview)\
            .filter(Interview.user_id == user_id, Question.user_answer != None)\
            .scalar() or 0
            
        # Simplified streak calculation
        current_streak = 1 if total_interviews > 0 else 0
        
        return {
            "total_interviews": total_interviews,
            "avg_score": round(avg_score, 1),
            "best_score": round(best_score, 1),
            "questions_answered": q_count,
            "current_streak": current_streak
        }

    def get_recent_interviews(self, user_id: int, limit: int = 5) -> list[dict]:
        interviews = self.db.query(Interview)\
            .filter(Interview.user_id == user_id)\
            .order_by(Interview.created_at.desc())\
            .limit(limit)\
            .all()
            
        return [
            {
                "id": inv.id,
                "role": inv.role,
                "score": inv.score,
                "date": inv.created_at.strftime("%Y-%m-%d")
            }
            for inv in interviews
        ]
