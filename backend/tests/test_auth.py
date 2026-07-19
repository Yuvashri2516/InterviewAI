"""
Tests for the authentication and user endpoints.
"""
from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


def test_signup(client: TestClient, db: Session) -> None:
    data = {
        "email": "newuser@example.com",
        "password": "newpassword",
        "full_name": "New User"
    }
    response = client.post(f"{settings.API_V1_STR}/auth/signup", json=data)
    assert response.status_code == 200
    content = response.json()
    assert content["email"] == data["email"]
    assert "id" in content


def test_login(client: TestClient, db: Session) -> None:
    # Create user
    data = {
        "email": "loginuser@example.com",
        "password": "loginpassword",
        "full_name": "Login User"
    }
    client.post(f"{settings.API_V1_STR}/auth/signup", json=data)
    
    # Login
    login_data = {
        "username": data["email"],
        "password": data["password"],
    }
    response = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    assert response.status_code == 200
    content = response.json()
    assert "access_token" in content
    assert "refresh_token" in content


def test_get_me(client: TestClient, user_token_headers: dict[str, str]) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/users/me", headers=user_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["email"] == "test@example.com"
