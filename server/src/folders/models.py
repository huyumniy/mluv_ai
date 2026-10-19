from sqlalchemy import DateTime, String, Text, Enum, Integer, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from datetime import datetime
from src.database import Base
from src.folders.enums import FolderType

class Folder(Base):
    __tablename__ = "folders"

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

    name: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
    )

    color: Mapped[str] = mapped_column(
        String(7),
        nullable=False,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    type: Mapped[FolderType] = mapped_column(
        Enum(
            FolderType,
            name="folder_type",
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        default=FolderType.CUSTOM,
        server_default=FolderType.CUSTOM.value,
        nullable=False,
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


class LessonFolder(Base):
    __tablename__ = "lesson_folders"

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey(
            "lessons.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    folder_id: Mapped[int] = mapped_column(
        ForeignKey(
            "folders.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )


class PlaylistFolder(Base):
    __tablename__ = "playlist_folders"

    playlist_id: Mapped[int] = mapped_column(
        ForeignKey(
            "playlists.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    folder_id: Mapped[int] = mapped_column(
        ForeignKey(
            "folders.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )