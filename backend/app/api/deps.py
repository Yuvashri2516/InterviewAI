"""
FastAPI dependencies.
"""
from __future__ import annotations

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AuthenticationError, NotFoundError
from app.core.security import verify_token
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repo import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """Dependency to get the current authenticated user."""
    payload = verify_token(token, expected_type="access")
    if not payload:
        raise AuthenticationError("Could not validate credentials")
        
    email: str | None = payload.get("sub")
    if not email:
        raise AuthenticationError("Could not validate credentials")
        
    user = UserRepository(db).get_by_email(email)
    if not user:
        raise NotFoundError("User")
        
    if not user.is_active:
        raise AuthenticationError("Inactive user")
        
    return user
