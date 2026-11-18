from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException

import src.auth.router as auth_router


def test_register_sends_verification_for_created_user(
    monkeypatch,
):
    db = MagicMock()
    request = MagicMock()

    data = SimpleNamespace(
        email="test@example.com",
        password="password",
        username="test",
    )

    created_user = SimpleNamespace(
        id=10,
        email="test@example.com",
        is_verified=False,
    )

    monkeypatch.setattr(
        auth_router.service,
        "get_by_email",
        lambda db, email: None,
    )

    monkeypatch.setattr(
        auth_router.service,
        "create",
        lambda db, data: created_user,
    )

    create_token = MagicMock(
        return_value="verification-token"
    )

    monkeypatch.setattr(
        auth_router,
        "create_email_verification_token",
        create_token,
    )

    send_email = MagicMock()

    monkeypatch.setattr(
        auth_router.send_verification_email_task,
        "delay",
        send_email,
    )

    result = auth_router.register(
        request=request,
        data=data,
        db=db,
    )

    assert result is created_user

    create_token.assert_called_once_with(
        created_user.id
    )

    send_email.assert_called_once_with(
        created_user.email,
        "verification-token",
    )


def test_register_existing_email_returns_409(
    monkeypatch,
):
    db = MagicMock()
    request = MagicMock()

    existing_user = SimpleNamespace(
        id=1,
        email="test@example.com",
    )

    monkeypatch.setattr(
        auth_router.service,
        "get_by_email",
        lambda db, email: existing_user,
    )

    data = SimpleNamespace(
        email="test@example.com",
        password="password",
        username="test",
    )

    with pytest.raises(HTTPException) as exc:
        auth_router.register(
            request=request,
            data=data,
            db=db,
        )

    assert exc.value.status_code == 409

def test_google_reuses_user_by_google_sub():
    db = MagicMock()

    existing_user = SimpleNamespace(
        id=15,
        email="old@gmail.com",
        google_sub="google-user-123456",
        is_verified=True,
    )

    db.scalar.return_value = existing_user

    user_info = {
        "sub": "google-user-123456",
        "email": "new@gmail.com",
        "email_verified": True,
    }

    user = auth_router.service.get_or_create_google_user(
        db,
        user_info,
    )

    assert user is existing_user

    db.add.assert_not_called()
    db.commit.assert_not_called()


@pytest.mark.asyncio
async def test_google_callback_redirects_to_frontend(
    monkeypatch,
):
    db = MagicMock()
    request = MagicMock()

    google_response = {
        "userinfo": {
            "sub": "google-123",
            "email": "test@gmail.com",
            "email_verified": True,
        }
    }

    monkeypatch.setattr(
        auth_router.oauth.google,
        "authorize_access_token",
        AsyncMock(
            return_value=google_response
        ),
    )

    user = SimpleNamespace(
        id=42,
        email="test@gmail.com",
        is_verified=True,
    )

    monkeypatch.setattr(
        auth_router.service,
        "get_or_create_google_user",
        lambda db, user_info: user,
    )

    monkeypatch.setattr(
        auth_router,
        "create_refresh_token",
        lambda user_id: "refresh-token",
    )

    set_cookie = MagicMock()

    monkeypatch.setattr(
        auth_router,
        "set_refresh_cookie",
        set_cookie,
    )

    result = await auth_router.google_callback(
        request=request,
        db=db,
    )

    assert result.status_code == 307

    assert result.headers["location"] == (
        f"{auth_router.settings.frontend_url}"
        "/auth/google/callback"
    )

    set_cookie.assert_called_once_with(
        result,
        "refresh-token",
    )


def test_google_reuses_existing_user(
    monkeypatch,
):
    db = MagicMock()
    db.scalar.return_value = None

    existing_user = SimpleNamespace(
        id=15,
        email="test@gmail.com",
        is_verified=True,
        google_sub=None,
    )

    monkeypatch.setattr(
        auth_router.service,
        "get_by_email",
        lambda db, email: existing_user,
    )

    user_info = {
        "sub": "google-user-123456",
        "email": "test@gmail.com",
        "email_verified": True,
    }

    user = auth_router.service.get_or_create_google_user(
        db,
        user_info,
    )

    assert user is existing_user
    assert user.google_sub == "google-user-123456"

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(existing_user)
    db.add.assert_not_called()


def test_google_verifies_existing_user(
    monkeypatch,
):
    db = MagicMock()
    db.scalar.return_value = None

    existing_user = SimpleNamespace(
        id=15,
        email="test@gmail.com",
        is_verified=False,
        google_sub=None,
    )

    monkeypatch.setattr(
        auth_router.service,
        "get_by_email",
        lambda db, email: existing_user,
    )

    user_info = {
        "sub": "google-user-123456",
        "email": "test@gmail.com",
        "email_verified": True,
    }

    user = auth_router.service.get_or_create_google_user(
        db,
        user_info,
    )

    assert user is existing_user
    assert user.is_verified is True
    assert user.google_sub == "google-user-123456"

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(existing_user)
    db.add.assert_not_called()


def test_google_creates_new_user(
    monkeypatch,
):
    db = MagicMock()
    db.scalar.return_value = None

    monkeypatch.setattr(
        auth_router.service,
        "get_by_email",
        lambda db, email: None,
    )

    user_info = {
        "sub": "google-user-123456",
        "email": "new@gmail.com",
        "email_verified": True,
    }

    user = auth_router.service.get_or_create_google_user(
        db,
        user_info,
    )

    assert user.email == "new@gmail.com"
    assert user.google_sub == "google-user-123456"
    assert user.is_verified is True
    assert user.password_hash is None

    db.add.assert_called_once_with(user)
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(user)


@pytest.mark.asyncio
async def test_google_callback_rejects_unverified_email(
    monkeypatch,
):
    db = MagicMock()
    request = MagicMock()

    monkeypatch.setattr(
        auth_router.oauth.google,
        "authorize_access_token",
        AsyncMock(
            return_value={
                "userinfo": {
                    "sub": "google-123",
                    "email": "test@gmail.com",
                    "email_verified": False,
                }
            }
        ),
    )

    with pytest.raises(HTTPException) as exc:
        await auth_router.google_callback(
            request=request,
            db=db,
        )

    assert exc.value.status_code == 400
