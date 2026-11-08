import pytest
from httpx import AsyncClient
from unittest.mock import Mock

from src.generation.schemas import (
    MissingGrammarError,
    PhraseGenerationError,
)
from fastapi import HTTPException
from src.generation.enums import GenerationType
from src.lessons.models import LessonPhrase
from src.generation import service as generation_service
from src.generation import router as generation_router
from .helpers import (
    register_user,
    get_authenticated_client,
)
from .helpers import create_lesson

@pytest.fixture(autouse=True)
def disable_generation_limits(
    monkeypatch,
):
    monkeypatch.setattr(
        generation_router,
        "check_user_limits",
        lambda user_id: None,
    )

    class FakeLock:
        def acquire(self):
            return True

        def owned(self):
            return True

        def release(self):
            pass

    monkeypatch.setattr(
        generation_router,
        "get_generation_lock",
        lambda **kwargs: FakeLock(),
    )


@pytest.mark.anyio
async def test_generation_status(
    client: AsyncClient,
):
    response = await client.get(
        "/generation/status"
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok"
    }


@pytest.mark.anyio
async def test_generate_lesson_queues_task(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    lesson = await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token,
    )

    apply_async_mock = Mock()

    monkeypatch.setattr(
        generation_router.generate_lesson_task,
        "apply_async",
        apply_async_mock,
    )

    response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}",
        json={
            "type": GenerationType.NEW,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 202

    data = response.json()

    assert data["lesson_id"] == lesson["id"]
    assert data["status"] == "queued"
    assert data["job_id"]
    assert data["task_id"]

    apply_async_mock.assert_called_once()

    call = apply_async_mock.call_args.kwargs

    assert call["task_id"] == data["task_id"]

    assert (
        call["kwargs"]["job_id"]
        == data["job_id"]
    )

    assert call["kwargs"]["user_id"]

    assert (
        call["kwargs"]["generation_type"]
        == GenerationType.NEW.value
    )

    assert (
        call["kwargs"]["phrase_count"]
        == 5
    )


@pytest.mark.anyio
async def test_get_generation_job(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    lesson = await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token,
    )

    monkeypatch.setattr(
        generation_router.generate_lesson_task,
        "apply_async",
        Mock(),
    )

    create_response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}",
        json={
            "type": GenerationType.NEW,
            "phrase_count": 5,
        },
    )

    assert create_response.status_code == 202

    job_id = (
        create_response
        .json()["job_id"]
    )

    response = await auth_client.get(
        f"/generation/jobs/{job_id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == job_id

    assert (
        data["lesson_id"]
        == lesson["id"]
    )

    assert data["status"] == "queued"
    assert data["error"] is None


@pytest.mark.anyio
async def test_duplicate_generation_returns_409(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    lesson = await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token,
    )

    monkeypatch.setattr(
        generation_router.generate_lesson_task,
        "apply_async",
        Mock(),
    )

    # First generation
    first_response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}",
        json={
            "type": GenerationType.NEW,
            "phrase_count": 5,
        },
    )

    assert first_response.status_code == 202

    # Same lesson while first job is still queued
    second_response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}",
        json={
            "type": GenerationType.NEW,
            "phrase_count": 5,
        },
    )

    assert second_response.status_code == 409


@pytest.mark.anyio
async def test_generate_phrases_requires_authentication(
    client: AsyncClient,
):
    response = await client.post(
        "/generation/lessons/1/phrases",
        json={
            "type": GenerationType.REPEAT,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 401

@pytest.mark.anyio
async def test_generate_phrases_for_missing_lesson_returns_404(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    def fake_generate(*args, **kwargs):
        return None

    monkeypatch.setattr(
        generation_service,
        "generate_phrases_for_lesson",
        fake_generate,
    )

    response = await auth_client.post(
        "/generation/lessons/99999/phrases",
        json={
            "type": GenerationType.REPEAT,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == (
        "Lesson not found"
    )


@pytest.mark.anyio
async def test_generate_phrases_without_grammar_returns_422(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )
    await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token
    )

    def fake_generate(*args, **kwargs):
        raise MissingGrammarError(
            "Lesson has no grammar assigned"
        )

    monkeypatch.setattr(
        generation_service,
        "generate_phrases_for_lesson",
        fake_generate,
    )

    response = await auth_client.post(
        "/generation/lessons/1/phrases",
        json={
            "type": GenerationType.REPEAT,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"] == (
        "Lesson has no grammar assigned"
    )


@pytest.mark.anyio
async def test_generation_failure_returns_502(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token
    )

    def fake_generate(*args, **kwargs):
        raise PhraseGenerationError(
            "Could not generate enough unique phrases"
        )

    monkeypatch.setattr(
        generation_service,
        "generate_phrases_for_lesson",
        fake_generate,
    )

    response = await auth_client.post(
        "/generation/lessons/1/phrases",
        json={
            "type": GenerationType.REPEAT,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 502


@pytest.mark.anyio
async def test_generate_phrases_success(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    lesson = await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token
    )

    def fake_generate(*args, **kwargs):
        new_phrases = [
            LessonPhrase(
                id=i,
                position=i,
                translation=f"Переклад {i}",
                original=f"Věta {i}",
                original_slowed=f"Věta... {i}",
            )
            for i in range(1, 6)
        ]

        old_phrases = [
            LessonPhrase(
                id=i,
                position=i,
                translation=f"Переклад {i}",
                original=f"Věta {i}",
                original_slowed=f"Věta... {i}",
            )
            for i in range(1, 46)
        ]

        all_phrases = (
            new_phrases
            + old_phrases
        )

        return (
            new_phrases,
            all_phrases,
        )


    monkeypatch.setattr(
        generation_service,
        "generate_phrases_for_lesson",
        fake_generate,
    )

    response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}/phrases",
        json={
            "type": GenerationType.NEW,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["lesson"]["id"] == lesson["id"]

    assert len(data["new_phrases"]) == 5
    assert len(data["phrases"]) == 50

    new_ids = {
        phrase["id"]
        for phrase in data["new_phrases"]
    }

    all_ids = {
        phrase["id"]
        for phrase in data["phrases"]
    }

    assert new_ids.issubset(all_ids)

@pytest.mark.anyio
async def test_generate_repeat_phrases_success(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    lesson = await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token
    )

    repeated_phrases = [
        LessonPhrase(
            id=i,
            position=i,
            translation=f"Переклад {i}",
            original=f"Věta {i}",
            original_slowed=f"Věta... {i}",
        )
        for i in range(1, 51)
    ]

    def fake_generate(*args, **kwargs):
        return (
            [],
            repeated_phrases,
        )

    monkeypatch.setattr(
        generation_service,
        "generate_phrases_for_lesson",
        fake_generate,
    )

    response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}/phrases",
        json={
            "type": GenerationType.REPEAT,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["lesson"]["id"] == lesson["id"]

    assert len(data["phrases"]) == 50

    assert data.get(
        "new_phrases",
        [],
    ) == []


@pytest.mark.anyio
async def test_generation_rate_limit_returns_429(
    client: AsyncClient,
    monkeypatch,
):
    await register_user(client)

    auth_client = await get_authenticated_client(
        client
    )

    lesson = await create_lesson(
        client,
        title="Czech Cases",
        token=auth_client.token
    )

    def fake_limit(user_id):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded",
        )

    monkeypatch.setattr(
        generation_router,
        "check_user_limits",
        fake_limit,
    )

    response = await auth_client.post(
        f"/generation/lessons/{lesson['id']}/phrases",
        json={
            "type": GenerationType.NEW,
            "phrase_count": 5,
        },
    )

    assert response.status_code == 429
    assert (
        response.json()["detail"]
        == "Rate limit exceeded"
    )
