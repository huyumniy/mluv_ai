import pytest
from httpx import AsyncClient

from .helpers import (
    create_folder,
    create_lesson,
    create_playlist,
)


@pytest.mark.anyio
async def test_create_playlist(
    client: AsyncClient,
):
    response = await client.post(
        "/playlists/",
        json={
            "title": "Grammar Essentials",
            "description": "Useful grammar lessons",
            "topic": "Grammar",
            "lessonIds": [],
            "folderIds": [],
        },
    )

    assert response.status_code == 201

    playlist = response.json()

    assert playlist["id"] is not None
    assert playlist["title"] == "Grammar Essentials"
    assert playlist["description"] == "Useful grammar lessons"
    assert playlist["topic"] == "Grammar"

    assert playlist["lessonIds"] == []
    assert playlist["folderIds"] == []


@pytest.mark.anyio
async def test_create_playlist_with_lessons(
    client: AsyncClient,
):
    first = await create_lesson(
        client,
        title="Czech Cases",
    )

    second = await create_lesson(
        client,
        title="Czech Pronouns",
    )

    playlist = await create_playlist(
        client,
        lesson_ids=[
            first["slug"],
            second["slug"],
        ],
    )

    assert playlist["lessonIds"] == [
        first["slug"],
        second["slug"],
    ]


@pytest.mark.anyio
async def test_playlist_preserves_lesson_order(
    client: AsyncClient,
):
    first = await create_lesson(
        client,
        title="Czech Cases",
    )

    second = await create_lesson(
        client,
        title="Czech Pronouns",
    )

    playlist = await create_playlist(
        client,
        lesson_ids=[
            second["slug"],
            first["slug"],
        ],
    )

    assert playlist["lessonIds"] == [
        second["slug"],
        first["slug"],
    ]


@pytest.mark.anyio
async def test_create_playlist_with_folder(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    playlist = await create_playlist(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    assert playlist["folderIds"] == [
        folder["id"],
    ]

@pytest.mark.anyio
async def test_get_playlist(
    client: AsyncClient,
):
    playlist = await create_playlist(
        client,
    )

    response = await client.get(
        f"/playlists/{playlist['id']}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == playlist["id"]
    assert data["title"] == playlist["title"]


@pytest.mark.anyio
async def test_get_non_existing_playlist_returns_404(
    client: AsyncClient,
):
    response = await client.get(
        "/playlists/999999"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_get_invalid_playlist_id_returns_422(
    client: AsyncClient,
):
    response = await client.get(
        "/playlists/invalid"
    )

    assert response.status_code == 422

@pytest.mark.anyio
async def test_update_playlist(
    client: AsyncClient,
):
    playlist = await create_playlist(
        client,
    )

    response = await client.patch(
        f"/playlists/{playlist['id']}",
        json={
            "title": "Advanced Grammar",
            "description": "Updated description",
            "topic": "Advanced Grammar",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["title"] == "Advanced Grammar"
    assert updated["description"] == "Updated description"
    assert updated["topic"] == "Advanced Grammar"


@pytest.mark.anyio
async def test_update_playlist_preserves_omitted_fields(
    client: AsyncClient,
):
    playlist = await create_playlist(
        client,
        title="Grammar Essentials",
        topic="Grammar",
    )

    response = await client.patch(
        f"/playlists/{playlist['id']}",
        json={
            "title": "Updated title",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["title"] == "Updated title"

    assert updated["topic"] == playlist["topic"]
    assert updated["description"] == playlist["description"]


@pytest.mark.anyio
async def test_update_playlist_replaces_lessons(
    client: AsyncClient,
):
    first = await create_lesson(
        client,
        title="Lesson One",
    )

    second = await create_lesson(
        client,
        title="Lesson Two",
    )

    playlist = await create_playlist(
        client,
        lesson_ids=[
            first["slug"],
        ],
    )

    response = await client.patch(
        f"/playlists/{playlist['id']}",
        json={
            "lessonIds": [
                second["slug"],
            ],
        },
    )

    assert response.status_code == 200

    assert response.json()["lessonIds"] == [
        second["slug"],
    ]


@pytest.mark.anyio
async def test_update_playlist_removes_all_lessons(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
    )

    playlist = await create_playlist(
        client,
        lesson_ids=[
            lesson["slug"],
        ],
    )

    response = await client.patch(
        f"/playlists/{playlist['id']}",
        json={
            "lessonIds": [],
        },
    )

    assert response.status_code == 200

    assert response.json()["lessonIds"] == []


@pytest.mark.anyio
async def test_update_playlist_keeps_lessons_when_omitted(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
    )

    playlist = await create_playlist(
        client,
        lesson_ids=[
            lesson["slug"],
        ],
    )

    response = await client.patch(
        f"/playlists/{playlist['id']}",
        json={
            "title": "Updated Playlist",
        },
    )

    assert response.status_code == 200

    assert response.json()["lessonIds"] == [
        lesson["slug"],
    ]


@pytest.mark.anyio
async def test_delete_playlist(
    client: AsyncClient,
):
    playlist = await create_playlist(
        client,
    )

    response = await client.delete(
        f"/playlists/{playlist['id']}"
    )

    assert response.status_code == 204

    response = await client.get(
        f"/playlists/{playlist['id']}"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_non_existing_playlist_returns_404(
    client: AsyncClient,
):
    response = await client.delete(
        "/playlists/999999"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_create_playlist_with_non_existing_lesson_returns_422(
    client: AsyncClient,
):
    response = await client.post(
        "/playlists/",
        json={
            "title": "Grammar Essentials",
            "description": "Test",
            "topic": "Grammar",
            "lessonIds": [
                "lesson-does-not-exist",
            ],
            "folderIds": [],
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_playlist_with_non_existing_folder_returns_422(
    client: AsyncClient,
):
    response = await client.post(
        "/playlists/",
        json={
            "title": "Grammar Essentials",
            "description": "Test",
            "topic": "Grammar",
            "lessonIds": [],
            "folderIds": [
                "folder-does-not-exist",
            ],
        },
    )

    assert response.status_code == 422
