from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from typing import Optional
from datetime import datetime

from src.lessons.enums import LessonLevel, LessonStatus

class LessonBase(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=255,
        description="Lesson title",
        examples=["Past Tense in Czech"],
    )

    description: str | None = Field(
        default=None,
        max_length=5000,
        description="Lesson description",
    )

    topic: str = Field(
        min_length=1,
        max_length=100,
        description="Main lesson topic",
        examples=["Grammar"],
    )

    level: LessonLevel = Field(
        default=LessonLevel.A1,
        description="CEFR difficulty level",
    )

    status: LessonStatus = Field(
        default=LessonStatus.NOT_STARTED,
        description="Possible statuses of lesson (not-started, listened, continue)",
    )

class LessonCreate(LessonBase):
    title: str = Field(
        min_length=3,
        max_length=255,
    )

    description: str | None = None

    topic: str = Field(
        min_length=1,
        max_length=100,
    )

    level: LessonLevel = Field(
            default=LessonLevel.A1,
            description="CEFR difficulty level",
        )
    
    status: LessonStatus = Field(
        default=LessonStatus.NOT_STARTED,
        description="Possible statuses of lesson (not-started, listened, continue)",
    )

    folder_ids: list[str] = Field(
        default_factory=list,
        alias="folderIds",
    )

class LessonUpdate(BaseModel):
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

    level: Optional[LessonLevel] = Field(default=LessonLevel.A1)

    status: LessonStatus = Field(
        default=LessonStatus.NOT_STARTED,
        description="Possible statuses of lesson (not-started, listened, continue)",
    )

    folder_ids: list[str] | None = Field(
        default=None,
        alias="folderIds",
    )


class LessonResponse(LessonBase):
    id: int
    slug: str
    title: str
    description: str | None
    topic: str
    duration_seconds: int
    phrase_count: int
    level: LessonLevel
    status: LessonStatus

    image_url: HttpUrl | None = None
    audio_url: HttpUrl | None = None
    pdf_url: HttpUrl | None = None

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


class LessonPhrase(BaseModel):
    position: int | None = Field(
        default=None,
        ge=0,
    )

    translation: str = Field(
        min_length=1,
        max_length=500,
    )

    original: str = Field(
        min_length=1,
        max_length=500,
    )

    original_slowed: str = Field(
        min_length=1,
        max_length=1000,
    )

class LessonPhraseResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )
    id: int
    position: int
    translation: str
    original: str
    original_slowed: str
