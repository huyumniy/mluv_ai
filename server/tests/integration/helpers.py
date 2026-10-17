from httpx import AsyncClient


async def create_folder(
    client: AsyncClient,
    *,
    name: str = "Work",
    color: str = "#ECB914",
    folder_type: str = "custom",
) -> dict:
    response = await client.post(
        "/folders/",
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
) -> dict:
    response = await client.post(
        "/lessons/",
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
    lesson_ids: list[str] | None = None,
    folder_ids: list[str] | None = None,
) -> dict:
    response = await client.post(
        "/playlists/",
        json={
            "title": title,
            "description": f"Description for {title}",
            "topic": topic,
            "lessonIds": lesson_ids or [],
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
) -> dict:
    response = await client.post(
        "/playlists/",
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
