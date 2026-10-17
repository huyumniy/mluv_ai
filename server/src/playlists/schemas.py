from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from datetime import datetime


class PlaylistBase(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=255,
        description="Playlist title",
        examples=["Past Tense in Czech"],
    )

    description: str | None = Field(
        default=None,
        max_length=5000,
        description="Playlist description",
    )

    topic: str = Field(
        min_length=1,
        max_length=100,
        description="Main playlist topic",
        examples=["Grammar"],
    )

class PlaylistCreate(PlaylistBase):
    lesson_ids: list[str] = Field(
        default_factory=list,
        alias="lessonIds",
    )

    folder_ids: list[str] = Field(
        default_factory=list,
        alias="folderIds",
    )

    model_config = ConfigDict(
        populate_by_name=True,
    )


class PlaylistUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=5000,
    )

    topic: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    lesson_ids: list[str] | None = Field(
        default=None,
        alias="lessonIds",
    )

    folder_ids: list[str] | None = Field(
        default=None,
        alias="folderIds",
    )

    model_config = ConfigDict(
        populate_by_name=True,
    )


class PlaylistResponse(PlaylistBase):
    id: int
    slug: str

    lesson_ids: list[str] = Field(
        default_factory=list,
        alias="lessonIds",
    )
    
    image_url: HttpUrl | None = None
    created_at: datetime
    updated_at: datetime

    folder_ids: list[str] = Field(
        default_factory=list,
        alias="folderIds",
    )

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )
