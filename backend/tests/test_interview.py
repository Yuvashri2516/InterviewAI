"""
Tests for the interview endpoints.
"""
from __future__ import annotations

from fastapi.testclient import TestClient

from app.core.config import settings


def test_generate_interview(client: TestClient, user_token_headers: dict[str, str]) -> None:
    data = {
        "role": "Software Engineer",
        "difficulty": "Easy",
        "interview_type": "Technical",
        "num_questions": 3
    }
    response = client.post(
        f"{settings.API_V1_STR}/interviews/generate",
        headers=user_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["role"] == data["role"]
    assert content["status"] == "in_progress"
    assert len(content["questions"]) == 3
    
    # Save the interview ID for the next test
    interview_id = content["id"]
    
    # Test getting the interview
    response = client.get(
        f"{settings.API_V1_STR}/interviews/{interview_id}",
        headers=user_token_headers,
    )
    assert response.status_code == 200


def test_get_interviews(client: TestClient, user_token_headers: dict[str, str]) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/interviews/",
        headers=user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert "items" in content
    assert "total" in content
