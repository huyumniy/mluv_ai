import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_get_me_without_token_returns_401(
    client: AsyncClient,
):
    response = await client.get(
        "/users/me"
    )

    assert response.status_code == 401
