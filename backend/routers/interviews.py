"""
Interviews router.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.interview import (
    AnswerSubmission,
    InterviewCreate,
    InterviewListResponse,
    InterviewResponse,
    SaveProgressRequest,
)
from app.services.interview_service import InterviewService

router = APIRouter()


@router.post("/generate", response_model=InterviewResponse)
async def generate_interview(
    obj_in: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Generate a new mock interview."""
    service = InterviewService(db)
    return await service.generate_interview(current_user.id, obj_in)


@router.get("/", response_model=PaginatedResponse[InterviewListResponse])
def get_interviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """List all interviews for the current user."""
    service = InterviewService(db)
    items, total = service.get_user_interviews(current_user.id, skip, limit)
    
    pages = (total + limit - 1) // limit
    page = (skip // limit) + 1
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_previous": page > 1,
    }


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get a specific interview."""
    service = InterviewService(db)
    return service.get_interview(interview_id, current_user.id)


@router.patch("/{interview_id}/save-progress", response_model=InterviewResponse)
def save_progress(
    interview_id: int,
    submission: SaveProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Save partial answers without fully evaluating."""
    service = InterviewService(db)
    return service.save_progress(interview_id, current_user.id, submission.answers)


@router.post("/{interview_id}/evaluate", response_model=InterviewResponse)
async def evaluate_interview(
    interview_id: int,
    submission: AnswerSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Submit final answers and evaluate the interview."""
    service = InterviewService(db)
    return await service.evaluate_interview(interview_id, current_user.id, submission)
