"""
User service.
"""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.exceptions import DuplicateError, NotFoundError
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register_user(self, user_in: UserCreate) -> User:
        user = self.user_repo.get_by_email(user_in.email)
        if user:
            raise DuplicateError("User", field="email")
        return self.user_repo.create(user_in)

    def get_profile(self, user_id: int) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        return user

    def update_profile(self, user_id: int, user_in: UserUpdate) -> User:
        user = self.get_profile(user_id)
        return self.user_repo.update(user, user_in)
