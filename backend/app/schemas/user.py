"""
User and Authentication schemas.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    target_job_role: str | None = None
    skills: list[str] | None = None
    education: list[dict[str, Any]] | None = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: str | None = None
    target_job_role: str | None = None
    skills: list[str] | None = None
    education: list[dict[str, Any]] | None = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    role: str
    created_at: datetime
    last_login: datetime | None = None

    model_config = {"from_attributes": True}


class UserProfileResponse(UserResponse):
    """Extended user response for the /me endpoint"""
    pass


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenWithRefresh(Token):
    refresh_token: str


class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None
