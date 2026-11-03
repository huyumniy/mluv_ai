from unittest.mock import Mock
import pytest
from fastapi import HTTPException

from src.generation import limits


def test_increment_limit_first_request(
    monkeypatch,
):
    redis_mock = Mock()

    redis_mock.incr.return_value = 1

    monkeypatch.setattr(
        limits,
        "redis",
        redis_mock,
    )

    limits.increment_limit(
        key="test:key",
        limit=3,
        ttl=60,
    )

    redis_mock.incr.assert_called_once_with(
        "test:key"
    )

    redis_mock.expire.assert_called_once_with(
        "test:key",
        60,
    )


def test_increment_limit_does_not_reset_ttl(
    monkeypatch,
):
    redis_mock = Mock()

    redis_mock.incr.return_value = 2

    monkeypatch.setattr(
        limits,
        "redis",
        redis_mock,
    )

    limits.increment_limit(
        key="test:key",
        limit=3,
        ttl=60,
    )

    redis_mock.expire.assert_not_called()


def test_increment_limit_raises_429(
    monkeypatch,
):
    redis_mock = Mock()

    redis_mock.incr.return_value = 4

    monkeypatch.setattr(
        limits,
        "redis",
        redis_mock,
    )

    with pytest.raises(
        HTTPException
    ) as exc:
        limits.increment_limit(
            key="test:key",
            limit=3,
            ttl=60,
        )

    assert exc.value.status_code == 429
    assert (
        exc.value.detail
        == "Rate limit exceeded"
    )


def test_check_user_limits(
    monkeypatch,
):
    increment_mock = Mock()

    monkeypatch.setattr(
        limits,
        "increment_limit",
        increment_mock,
    )

    limits.check_user_limits(
        user_id=42
    )

    assert increment_mock.call_count == 2

    increment_mock.assert_any_call(
        key="generation:user:42:minute",
        limit=3,
        ttl=60,
    )

    increment_mock.assert_any_call(
        key="generation:user:42:day",
        limit=30,
        ttl=86400,
    )


def test_check_groq_budget(
    monkeypatch,
):
    increment_mock = Mock()

    monkeypatch.setattr(
        limits,
        "increment_limit",
        increment_mock,
    )

    limits.check_groq_budget()

    increment_mock.assert_called_once_with(
        key="groq:requests:minute",
        limit=20,
        ttl=60,
    )


def test_generation_lock(
    monkeypatch,
):
    redis_mock = Mock()
    lock_mock = Mock()

    redis_mock.lock.return_value = (
        lock_mock
    )

    monkeypatch.setattr(
        limits,
        "redis",
        redis_mock,
    )

    result = limits.get_generation_lock(
        user_id=12,
        lesson_id=7,
    )

    redis_mock.lock.assert_called_once_with(
        name="generation:user:12:lesson:7",
        timeout=180,
        blocking=False,
    )

    assert result is lock_mock
