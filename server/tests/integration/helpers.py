from httpx import AsyncClient

from httpx import AsyncClient, Response


class AuthClient:
    def __init__(
        self,
        client: AsyncClient,
        token: str,
    ):
        self.client = client
        self.token = token

    def _headers(
        self,
        headers: dict | None = None,
    ) -> dict:
        return {
            "Authorization": f"Bearer {self.token}",
            **(headers or {}),
        }

    async def get(
        self,
        url: str,
        **kwargs,
    ) -> Response:
        headers = kwargs.pop(
            "headers",
            None,
        )

        return await self.client.get(
            url,
            headers=self._headers(headers),
            **kwargs,
        )

    async def post(
        self,
        url: str,
        **kwargs,
    ) -> Response:
        headers = kwargs.pop(
            "headers",
            None,
        )

        return await self.client.post(
            url,
            headers=self._headers(headers),
            **kwargs,
        )

    async def patch(
        self,
        url: str,
        **kwargs,
    ) -> Response:
        headers = kwargs.pop(
            "headers",
            None,
        )

        return await self.client.patch(
            url,
            headers=self._headers(headers),
            **kwargs,
        )

    async def put(
        self,
        url: str,
        **kwargs,
    ) -> Response:
        headers = kwargs.pop(
            "headers",
            None,
        )

        return await self.client.put(
            url,
            headers=self._headers(headers),
            **kwargs,
        )

    async def delete(
        self,
        url: str,
        **kwargs,
    ) -> Response:
        headers = kwargs.pop(
            "headers",
            None,
        )

        return await self.client.delete(
            url,
            headers=self._headers(headers),
            **kwargs,
        )


async def create_folder(
    client: AsyncClient,
    *,
    name: str = "Work",
    color: str = "#ECB914",
    folder_type: str = "custom",
    token: str
) -> dict:
    response = await client.post(
        "/folders/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": name,
            "color": color,
            "type": folder_type,
        },
    )

    assert response.status_code == 201

    return response.json()


async def create_lesson(
    client: AsyncClient,
    *,
    title: str = "Czech Cases",
    topic: str = "Grammar",
    level: str = "B1",
    folder_ids: list[str] | None = None,
    token: str
) -> dict:
    response = await client.post(
        "/lessons/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "title": title,
            "description": f"Description for {title}",
            "topic": topic,
            "level": level,
            "folderIds": folder_ids or [],
        },
    )

    assert response.status_code == 201

    return response.json()


async def create_playlist(
    client: AsyncClient,
    *,
    title: str = "Grammar Essentials",
    topic: str = "Grammar",
    description: str = "Useful grammar lessons",
    lesson_ids: list[str] | None = None,
    folder_ids: list[str] | None = None,
    token: str
) -> dict:
    response = await client.post(
        "/playlists/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "title": title,
            "description": description,
            "topic": topic,
            "lessonIds": lesson_ids or [],
            "folderIds": folder_ids or [],
        },
    )

    assert response.status_code == 201

    return response.json()


async def register_user(
    client: AsyncClient,
    *,
    email: str = "alice@example.com",
    username: str = "alice",
    password: str = "password123",
):
    response = await client.post(
        "/auth/register",
        json={
            "email": email,
            "username": username,
            "password": password,
        },
    )

    assert response.status_code == 201

    return response.json()


async def login_user(
    client: AsyncClient,
    *,
    username: str = "alice",
    password: str = "password123",
) -> str:
    response = await client.post(
        "/auth/login",
        data={
            "username": username,
            "password": password,
        },
    )

    assert response.status_code == 200

    return response.json()["access_token"]


async def get_authenticated_client(
    client: AsyncClient,
    *,
    username: str = "alice",
    password: str = "password123",
) -> AuthClient:
    token = await login_user(
        client,
        username=username,
        password=password,
    )

    return AuthClient(
        client,
        token,
    )
