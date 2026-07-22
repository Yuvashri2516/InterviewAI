"""
User models.
"""
from __future__ import annotations

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.dialects.sqlite import JSON

from app.database.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """User account model."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    full_name = Column(String, index=True, nullable=True)
    role = Column(String, default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    target_job_role = Column(String, nullable=True)
    skills = Column(JSON, nullable=True)
    education = Column(JSON, nullable=True)
    
    last_login = Column(DateTime(timezone=True), nullable=True)
