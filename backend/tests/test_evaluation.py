"""
Tests for evaluation and reports endpoints.
"""
from __future__ import annotations

from fastapi.testclient import TestClient

from app.core.config import settings


def test_save_progress(client: TestClient, user_token_headers: dict[str, str]) -> None:
    # Generate interview first
    gen_data = {
        "role": "Software Engineer",
        "difficulty": "Easy",
        "interview_type": "Technical",
        "num_questions": 1
    }
    r = client.post(f"{settings.API_V1_STR}/interviews/generate", headers=user_token_headers, json=gen_data)
    interview = r.json()
    interview_id = interview["id"]
    q_id = interview["questions"][0]["id"]
    
    # Save progress
    save_data = {
        "answers": {
            str(q_id): "This is a partial answer."
        }
    }
    response = client.patch(
        f"{settings.API_V1_STR}/interviews/{interview_id}/save-progress",
        headers=user_token_headers,
        json=save_data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["questions"][0]["user_answer"] == "This is a partial answer."


def test_evaluate_interview(client: TestClient, user_token_headers: dict[str, str]) -> None:
    # Generate interview first
    gen_data = {
        "role": "Software Engineer",
        "difficulty": "Easy",
        "interview_type": "Technical",
        "num_questions": 1
    }
    r = client.post(f"{settings.API_V1_STR}/interviews/generate", headers=user_token_headers, json=gen_data)
    interview = r.json()
    interview_id = interview["id"]
    q_id = interview["questions"][0]["id"]
    
    # Evaluate
    eval_data = {
        "answers": {
            str(q_id): "This is a complete technical answer demonstrating knowledge."
        }
    }
    response = client.post(
        f"{settings.API_V1_STR}/interviews/{interview_id}/evaluate",
        headers=user_token_headers,
        json=eval_data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["status"] == "completed"
    assert content["score"] is not None
    assert content["summary"] is not None


def test_download_report(client: TestClient, user_token_headers: dict[str, str]) -> None:
    # Assuming the interview from previous test exists and is completed
    # Get interviews to find a valid ID
    r = client.get(f"{settings.API_V1_STR}/interviews/", headers=user_token_headers)
    interviews = r.json()["items"]
    
    if interviews:
        interview_id = interviews[0]["id"]
        response = client.get(
            f"{settings.API_V1_STR}/reports/interview/{interview_id}/pdf",
            headers=user_token_headers,
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"


def test_analytics_dashboard(client: TestClient, user_token_headers: dict[str, str]) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/analytics/dashboard",
        headers=user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert "total_interviews" in content
    assert "avg_score" in content
