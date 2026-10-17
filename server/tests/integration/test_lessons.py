import pytest
from httpx import AsyncClient
from helpers import create_lesson, create_folder

@pytest.mark.anyio
async def test_get_lesson(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
        title="Czech Cases",
    )

    response = await client.get(
        f"/lessons/{lesson['id']}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == lesson["id"]
    assert data["title"] == "Czech Cases"


@pytest.mark.anyio
async def test_get_non_existing_lesson_returns_404(
    client: AsyncClient,
):
    response = await client.get(
        "/lessons/99999"
    )

    assert response.status_code == 404

    
@pytest.mark.anyio
async def test_get_invalid_lesson_returns_422(
    client: AsyncClient,
):
    response = await client.get(
        "/lessons/invalid"
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_get_lesson_rejects_zero_id(
    client: AsyncClient,
):
    response = await client.get("/lessons/0")

    assert response.status_code == 422


@pytest.mark.anyio
async def test_get_lesson_rejects_negative_id(
    client: AsyncClient,
):
    response = await client.get("/lessons/-1")

    assert response.status_code == 422


@pytest.mark.anyio
async def test_get_lesson_rejects_zero_id(
    client: AsyncClient,
):
    response = await client.get("/lessons/0")

    assert response.status_code == 422


@pytest.mark.anyio
async def test_get_lesson_rejects_negative_id(
    client: AsyncClient,
):
    response = await client.get("/lessons/-1")

    assert response.status_code == 422


@pytest.mark.anyio
async def test_update_lesson(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
        title="Czech Cases",
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "title": "Advanced Czech Cases",
            "description": "Updated description",
            "level": "B2",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["id"] == lesson["id"]
    assert updated["title"] == "Advanced Czech Cases"
    assert updated["description"] == "Updated description"
    assert updated["level"] == "B2"


@pytest.mark.anyio
async def test_update_lesson_preserves_omitted_fields(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
        title="Czech Cases",
        topic="Grammar",
        level="B1",
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "title": "Updated Czech Cases",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["title"] == "Updated Czech Cases"
    assert updated["topic"] == lesson["topic"]
    assert updated["description"] == lesson["description"]
    assert updated["level"] == lesson["level"]


@pytest.mark.anyio
async def test_update_lesson_removes_all_folders(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "folderIds": [],
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["folderIds"] == []


@pytest.mark.anyio
async def test_update_lesson_replaces_folder(
    client: AsyncClient,
):
    grammar = await create_folder(
        client,
        name="Grammar",
    )

    work = await create_folder(
        client,
        name="Work",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            grammar["id"],
        ],
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "folderIds": [
                work["id"],
            ],
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["folderIds"] == [
        work["id"],
    ]


@pytest.mark.anyio
async def test_update_lesson_keeps_folders_when_folder_ids_omitted(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "title": "Updated Czech Cases",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["folderIds"] == [
        folder["id"],
    ]


@pytest.mark.anyio
async def test_update_lesson_with_non_existing_folder_returns_422(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "folderIds": [
                "does-not-exist",
            ],
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_update_non_existing_lesson_returns_404(
    client: AsyncClient,
):
    response = await client.patch(
        "/lessons/999999",
        json={
            "title": "Updated",
        },
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_update_lesson_with_invalid_level_returns_422(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "level": "Z99",
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_delete_lesson(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
    )

    response = await client.delete(
        f"/lessons/{lesson['id']}"
    )

    assert response.status_code == 204

    # Make sure it was REALLY deleted.
    response = await client.get(
        f"/lessons/{lesson['id']}"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_non_existing_lesson_returns_404(
    client: AsyncClient,
):
    response = await client.delete(
        "/lessons/999999"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_invalid_lesson_id_returns_422(
    client: AsyncClient,
):
    response = await client.delete(
        "/lessons/invalid"
    )

    assert response.status_code == 422

@pytest.mark.anyio
async def test_delete_lesson(
    client: AsyncClient,
):
    lesson = await create_lesson(
        client,
        title="Czech Cases",
    )

    response = await client.delete(
        f"/lessons/{lesson['id']}"
    )

    assert response.status_code == 204

    response = await client.get(
        f"/lessons/{lesson['id']}"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_create_lesson_with_folder(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar"
    )

    lesson = await create_lesson(
        client,
        folder_ids= [
            folder["id"]
        ]
    )

    assert lesson["folderIds"] == [
        "grammar"
    ]


@pytest.mark.anyio
async def test_create_lesson_with_non_existing_folder_id(
    client: AsyncClient,
):
    response = await client.post(
        "/lessons/",
        json={
            "title": "Czech Cases",
            "description": "Description for Czech Cases",
            "topic": "Grammar",
            "level": "B1",
            "folderIds": [
                "non-existing",
            ],
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_lesson_with_invalid_folder_id_type(
    client: AsyncClient,
):
    response = await client.post(
        "/lessons/",
        json={
            "title": "Czech Cases",
            "description": "Description for Czech Cases",
            "topic": "Grammar",
            "level": "B1",
            "folderIds": [
                1,
            ],
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_lesson_rejects_if_one_folder_does_not_exist(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    response = await client.post(
        "/lessons/",
        json={
            "title": "Czech Cases",
            "description": "Description",
            "topic": "Grammar",
            "level": "B1",
            "folderIds": [
                folder["id"],
                "folder-does-not-exist",
            ],
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_lesson_with_multiple_folders(
    client: AsyncClient,
):
    grammar = await create_folder(
        client,
        name="Grammar",
    )

    work = await create_folder(
        client,
        name="Work",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            grammar["id"],
            work["id"],
        ],
    )

    assert set(lesson["folderIds"]) == {
        grammar["id"],
        work["id"],
    }


@pytest.mark.anyio
async def test_get_lesson_returns_folder_ids(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    response = await client.get(
        f"/lessons/{lesson['id']}"
    )

    assert response.status_code == 200

    assert response.json()["folderIds"] == [
        folder["id"],
    ]


@pytest.mark.anyio
async def test_lessons_list_returns_folder_ids(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    await create_lesson(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    response = await client.get(
        "/lessons/"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["items"][0]["folderIds"] == [
        folder["id"],
    ]


@pytest.mark.anyio
async def test_update_lesson_removes_all_folders(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    response = await client.patch(
        f"/lessons/{lesson['id']}",
        json={
            "folderIds": [],
        },
    )

    assert response.status_code == 200

    assert response.json()["folderIds"] == []


@pytest.mark.anyio
async def test_delete_folder_does_not_delete_lesson(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    lesson = await create_lesson(
        client,
        folder_ids=[
            folder["id"],
        ],
    )

    delete_response = await client.delete(
        f"/folders/{folder['id']}"
    )

    assert delete_response.status_code == 204

    lesson_response = await client.get(
        f"/lessons/{lesson['id']}"
    )

    assert lesson_response.status_code == 200

    assert lesson_response.json()["folderIds"] == []
