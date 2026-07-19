"""
Users router.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
def read_user_me(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current user profile."""
    return current_user


@router.patch("/me", response_model=UserProfileResponse)
def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """Update current user profile."""
    user_service = UserService(db)
    return user_service.update_profile(current_user.id, user_in)
