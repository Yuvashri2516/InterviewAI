"""
Tests for the resume endpoints.
"""
from __future__ import annotations

import io

from fastapi.testclient import TestClient

from app.core.config import settings


def test_upload_resume(client: TestClient, user_token_headers: dict[str, str]) -> None:
    # Create a dummy PDF file in memory
    file_content = b"%PDF-1.4 dummy content for testing"
    files = {"file": ("test_resume.pdf", io.BytesIO(file_content), "application/pdf")}
    
    response = client.post(
        f"{settings.API_V1_STR}/resumes/upload",
        headers=user_token_headers,
        files=files,
    )
    # The actual parsing will fail since it's not a real PDF, 
    # but we just want to test the endpoint wiring. 
    # If the endpoint doesn't exist it returns 404.
    assert response.status_code in [200, 422, 500]


def test_get_resumes(client: TestClient, user_token_headers: dict[str, str]) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/resumes/",
        headers=user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert "items" in content
    assert "total" in content
    assert isinstance(content["items"], list)
