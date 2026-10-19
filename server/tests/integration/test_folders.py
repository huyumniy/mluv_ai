import pytest
from httpx import AsyncClient

from .helpers import create_folder, register_user, login_user, get_authenticated_client

@pytest.mark.anyio
async def test_get_folder(
    client: AsyncClient,
):
    await register_user(client)
    auth_client = await get_authenticated_client(client)

    folder = await create_folder(
        auth_client,
        name="Grammar",
        token=auth_client.token,
    )

    response = await auth_client.get(
        f"/folders/{folder['id']}",
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
    await register_user(client)
    token = await login_user(client)
    
    response = await client.get(
        "/folders/does-not-exist",
        headers={
            "Authorization": f"Bearer {token}",
        },

    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_update_folder(
    client: AsyncClient,
):
    await register_user(client)
    token = await login_user(client)
    folder = await create_folder(
        client,
        name="Grammar",
        token=token
    )

    response = await client.patch(
        f"/folders/{folder['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
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
    await register_user(client)
    token = await login_user(client)
    folder = await create_folder(
        client,
        name="Grammar",
        token=token
    )

    response = await client.patch(
        f"/folders/{folder['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
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
    await register_user(client)
    token = await login_user(client)

    folder = await create_folder(
        client,
        name="Grammar",
        token=token
    )

    response = await client.patch(
        f"/folders/{folder['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "color": "red",
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_update_non_existing_folder_returns_404(
    client: AsyncClient,
):
    await register_user(client)
    token = await login_user(client)
    
    response = await client.patch(
        "/folders/does-not-exist",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": "Updated Folder",
        },
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_folder(
    client: AsyncClient,
):
    await register_user(client)
    token = await login_user(client)
    
    folder = await create_folder(
        client,
        name="Grammar",
        token=token
    )

    response = await client.delete(
        f"/folders/{folder['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },

    )

    assert response.status_code == 204

    response = await client.get(
        f"/folders/{folder['id']}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_non_existing_folder_returns_404(
    client: AsyncClient,
):
    await register_user(client)
    token = await login_user(client)
        
    response = await client.delete(
        "/folders/does-not-exist",
        headers={
            "Authorization": f"Bearer {token}",
        },

    )

    assert response.status_code == 404