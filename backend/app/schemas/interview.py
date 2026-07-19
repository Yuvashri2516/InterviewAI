"""
Interview and Question schemas.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class QuestionBase(BaseModel):
    question_text: str


class QuestionCreate(QuestionBase):
    pass


class QuestionResponse(QuestionBase):
    id: int
    interview_id: int
    user_answer: str | None = None
    
    score: float | None = None
    technical_accuracy: float | None = None
    clarity_score: float | None = None
    communication_score: float | None = None
    completeness_score: float | None = None
    
    suggestions: str | None = None
    ideal_answer: str | None = None
    ai_feedback: str | None = None

    model_config = {"from_attributes": True}


class InterviewBase(BaseModel):
    role: str
    difficulty: str
    interview_type: str


class InterviewCreate(InterviewBase):
    resume_id: int | None = None
    num_questions: int = 5


class InterviewResponse(InterviewBase):
    id: int
    user_id: int
    resume_id: int | None = None
    status: str
    num_questions: int
    score: float | None = None
    summary: str | None = None
    created_at: datetime
    questions: list[QuestionResponse] = []

    model_config = {"from_attributes": True}


class InterviewListResponse(InterviewBase):
    """Lighter version for list views (no questions array)."""
    id: int
    user_id: int
    status: str
    num_questions: int
    score: float | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class SaveProgressRequest(BaseModel):
    """Schema for saving partial answers."""
    answers: dict[int, str]  # {question_id: answer_text}


class AnswerSubmission(BaseModel):
    answers: dict[int, str]
