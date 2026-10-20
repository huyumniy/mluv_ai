from sqlalchemy import DateTime, String, Text, Enum, Integer, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
from src.database import Base

from src.lessons.enums import LessonLevel, LessonStatus
from src.folders.models import Folder

class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    topic: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    level: Mapped[LessonLevel] = mapped_column(
        Enum(
            LessonLevel,
            name="lesson_level",
        ),
        default=LessonLevel.A1,
        server_default=LessonLevel.A1.value,
    )

    status: Mapped[LessonStatus] = mapped_column(
        Enum(
            LessonStatus,
            name="lesson_status",
            values_callable=lambda enum: [
                item.value for item in enum
            ]
        ),
        default=LessonStatus.NOT_STARTED,
        server_default=LessonStatus.NOT_STARTED.value,
        nullable=False,
    )

    duration_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    phrase_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    image_key: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    audio_key: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    pdf_key: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    folders: Mapped[list["Folder"]] = relationship(
        secondary="lesson_folders",
    )
