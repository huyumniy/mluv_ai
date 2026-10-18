import pytest
from httpx import AsyncClient

from .helpers import create_folder

@pytest.mark.anyio
async def test_get_folder(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    response = await client.get(
        f"/folders/{folder['id']}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == folder["id"]
    assert data["name"] == "Grammar"
    assert data["color"] == "#ECB914"
    assert data["type"] == "custom"


@pytest.mark.anyio
async def test_get_non_existing_folder_returns_404(
    client: AsyncClient,
):
    response = await client.get(
        "/folders/does-not-exist"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_update_folder(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    response = await client.patch(
        f"/folders/{folder['id']}",
        json={
            "name": "Czech Grammar",
            "color": "#123456",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["name"] == "Czech Grammar"
    assert updated["color"] == "#123456"


@pytest.mark.anyio
async def test_update_folder_preserves_omitted_fields(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    response = await client.patch(
        f"/folders/{folder['id']}",
        json={
            "color": "#123456",
        },
    )

    assert response.status_code == 200

    updated = response.json()

    assert updated["name"] == folder["name"]
    assert updated["type"] == folder["type"]

    assert updated["color"] == "#123456"


@pytest.mark.anyio
async def test_update_folder_with_invalid_color_returns_422(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    response = await client.patch(
        f"/folders/{folder['id']}",
        json={
            "color": "red",
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_update_non_existing_folder_returns_404(
    client: AsyncClient,
):
    response = await client.patch(
        "/folders/does-not-exist",
        json={
            "name": "Updated Folder",
        },
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_folder(
    client: AsyncClient,
):
    folder = await create_folder(
        client,
        name="Grammar",
    )

    response = await client.delete(
        f"/folders/{folder['id']}"
    )

    assert response.status_code == 204

    # Verify that it actually disappeared.
    response = await client.get(
        f"/folders/{folder['id']}"
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_non_existing_folder_returns_404(
    client: AsyncClient,
):
    response = await client.delete(
        "/folders/does-not-exist"
    )

    assert response.status_code == 404