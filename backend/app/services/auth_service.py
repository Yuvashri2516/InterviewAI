"""
Authentication service.
"""
from __future__ import annotations

from typing import Any

from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.exceptions import AuthenticationError
from app.core.security import create_access_token, create_refresh_token, verify_password, verify_token
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user import TokenWithRefresh


class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def authenticate(self, form_data: OAuth2PasswordRequestForm) -> User:
        user = self.user_repo.get_by_email(form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise AuthenticationError("Incorrect email or password")
        if not user.is_active:
            raise AuthenticationError("Inactive user")
        
        self.user_repo.update_last_login(user)
        return user

    def create_tokens(self, user: User) -> TokenWithRefresh:
        data = {"sub": user.email, "role": user.role}
        access_token = create_access_token(data=data)
        refresh_token = create_refresh_token(data=data)
        return TokenWithRefresh(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    def refresh_access_token(self, refresh_token: str) -> TokenWithRefresh:
        payload = verify_token(refresh_token, expected_type="refresh")
        if not payload:
            raise AuthenticationError("Invalid or expired refresh token")
            
        email = payload.get("sub")
        if not email:
            raise AuthenticationError("Invalid token payload")
            
        user = self.user_repo.get_by_email(email)
        if not user or not user.is_active:
            raise AuthenticationError("User not found or inactive")
            
        self.user_repo.update_last_login(user)
        return self.create_tokens(user)
