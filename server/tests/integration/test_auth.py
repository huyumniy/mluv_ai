import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_get_me_returns_authenticated_user(
    client: AsyncClient,
):
    await client.post(
        "/auth/register",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "password123",
        },
    )

    login = await client.post(
        "/auth/login",
        data={
            "username": "alice",
            "password": "password123",
        },
    )

    token = login.json()["access_token"]

    response = await client.get(
        "/users/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    user = response.json()

    assert user["username"] == "alice"
    assert user["email"] == "alice@example.com"


@pytest.mark.anyio
async def test_get_me_with_invalid_token_returns_401(
    client: AsyncClient,
):
    response = await client.get(
        "/users/me",
        headers={
            "Authorization": "Bearer definitely-not-a-jwt",
        },
    )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_login_with_wrong_password_returns_401(
    client: AsyncClient,
):
    await client.post(
        "/auth/register",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "password123",
        },
    )

    response = await client.post(
        "/auth/login",
        data={
            "username": "alice",
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_login_with_non_existing_user_returns_401(
    client: AsyncClient,
):
    response = await client.post(
        "/auth/login",
        data={
            "username": "does-not-exist",
            "password": "password123",
        },
    )

    assert response.status_code == 401
