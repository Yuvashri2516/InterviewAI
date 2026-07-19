"""
Common schemas shared across the application.
"""
from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class StandardResponse(BaseModel, Generic[T]):
    """Standard success response format."""
    success: bool = True
    message: str = "Operation successful"
    data: T | None = None


class ErrorResponse(BaseModel):
    """Standard error response format."""
    success: bool = False
    detail: str
    status_code: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response format."""
    items: list[T]
    total: int
    page: int
    size: int
    pages: int
    has_next: bool
    has_previous: bool
