"""
Custom exception classes and FastAPI exception handlers.
"""
from __future__ import annotations

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse


# ── Custom Exceptions ─────────────────────────────────────────────────────────

class AppException(Exception):
    """Base application exception."""

    def __init__(self, detail: str, status_code: int = 500) -> None:
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class NotFoundError(AppException):
    """Resource not found."""

    def __init__(self, resource: str = "Resource", resource_id: int | str = "") -> None:
        detail = f"{resource} not found"
        if resource_id:
            detail = f"{resource} with id '{resource_id}' not found"
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class DuplicateError(AppException):
    """Duplicate resource."""

    def __init__(self, resource: str = "Resource", field: str = "") -> None:
        detail = f"{resource} already exists"
        if field:
            detail = f"{resource} with this {field} already exists"
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)


class AuthenticationError(AppException):
    """Authentication failure."""

    def __init__(self, detail: str = "Could not validate credentials") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class ForbiddenError(AppException):
    """Authorization failure."""

    def __init__(self, detail: str = "You do not have permission to perform this action") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)


class BadRequestError(AppException):
    """Invalid request data."""

    def __init__(self, detail: str = "Bad request") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_400_BAD_REQUEST)


class FileValidationError(AppException):
    """Invalid file upload."""

    def __init__(self, detail: str = "Invalid file") -> None:
        super().__init__(detail=detail, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


# ── Exception Handlers ───────────────────────────────────────────────────────

def register_exception_handlers(app: FastAPI) -> None:
    """Register all custom exception handlers on the FastAPI app."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "detail": exc.detail,
                "status_code": exc.status_code,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "detail": "An unexpected error occurred. Please try again later.",
                "status_code": 500,
            },
        )
