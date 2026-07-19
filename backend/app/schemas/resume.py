from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ParsedResumeData(BaseModel):
    skills: list[Any] | dict[str, Any] | None = None
    projects: list[Any] | dict[str, Any] | None = None
    education: list[Any] | dict[str, Any] | None = None
    experience: list[Any] | dict[str, Any] | None = None

    model_config = ConfigDict(from_attributes=True)


class ResumeBase(BaseModel):
    original_filename: str


class ResumeCreate(ResumeBase):
    user_id: int
    file_path: str
    parsed_text: str
    skills: list[Any] | dict[str, Any] | None = None
    projects: list[Any] | dict[str, Any] | None = None
    education: list[Any] | dict[str, Any] | None = None
    experience: list[Any] | dict[str, Any] | None = None


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    file_path: str
    parsed_text: str
    skills: list[Any] | dict[str, Any] | None = None
    projects: list[Any] | dict[str, Any] | None = None
    education: list[Any] | dict[str, Any] | None = None
    experience: list[Any] | dict[str, Any] | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResumeListResponse(BaseModel):
    items: list[ResumeResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)
