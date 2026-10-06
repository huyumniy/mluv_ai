from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

from src.lessons.enums import LessonLevel


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

class LessonCreate(LessonBase):
    pass


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


class LessonResponse(LessonBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )