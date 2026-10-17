from sqlalchemy import DateTime, String, Text, Enum, Integer, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
from src.database import Base
from src.folders.models import Folder
from src.lessons.models import Lesson

class Playlist(Base):
    __tablename__ = "playlists"

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

    image_key: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
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
        secondary="playlist_folders",
    )

    playlist_lessons: Mapped[list["PlaylistLesson"]] = relationship(
        back_populates="playlist",
        cascade="all, delete-orphan",
        order_by="PlaylistLesson.position",
    )


class PlaylistLesson(Base):
    __tablename__ = "playlist_lessons"

    playlist_id: Mapped[int] = mapped_column(
        ForeignKey(
            "playlists.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey(
            "lessons.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    playlist: Mapped["Playlist"] = relationship(
        back_populates="playlist_lessons",
    )

    lesson: Mapped["Lesson"] = relationship()