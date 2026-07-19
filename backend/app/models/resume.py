from __future__ import annotations

from typing import Any

from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin

class Resume(Base, TimestampMixin):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    original_filename: Mapped[str] = mapped_column(String, nullable=False)
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    parsed_text: Mapped[str] = mapped_column(String, nullable=False)
    skills: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(JSON, nullable=True)
    projects: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(JSON, nullable=True)
    education: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(JSON, nullable=True)
    experience: Mapped[dict[str, Any] | list[Any] | None] = mapped_column(JSON, nullable=True)
