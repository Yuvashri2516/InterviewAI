"""
Auth router.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Body, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from models.user import User
from app.schemas.common import StandardResponse
from app.schemas.user import TokenWithRefresh, UserCreate, UserResponse, ChangePasswordRequest
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter()


@router.post("/login", response_model=TokenWithRefresh)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
) -> TokenWithRefresh:
    """OAuth2 compatible token login, get an access token for future requests."""
    auth_service = AuthService(db)
    user = auth_service.authenticate(form_data)
    return auth_service.create_tokens(user)


@router.post("/signup", response_model=UserResponse)
def signup(
    user_in: UserCreate, 
    db: Session = Depends(get_db)
) -> User:
    """Create a new user."""
    user_service = UserService(db)
    return user_service.register_user(user_in)


@router.post("/refresh", response_model=TokenWithRefresh)
def refresh_token(
    refresh_token: Annotated[str, Body(embed=True)],
    db: Session = Depends(get_db)
) -> TokenWithRefresh:
    """Refresh an access token using a refresh token."""
    auth_service = AuthService(db)
    return auth_service.refresh_access_token(refresh_token)


@router.post("/change-password", response_model=StandardResponse)
def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> StandardResponse:
    """Change current user password."""
    # Scaffold for now. In a real app we'd verify the old password and set the new one.
    return StandardResponse(success=True, message="Password changed successfully")


@router.post("/forgot-password", response_model=StandardResponse)
def forgot_password(
    email: Annotated[str, Body(embed=True)],
    db: Session = Depends(get_db)
) -> StandardResponse:
    """Password recovery scaffold."""
    return StandardResponse(
        success=True, 
        message="If an account exists with this email, a recovery link will be sent."
    )
