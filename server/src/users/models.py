from sqlalchemy import DateTime, String, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
from src.database import Base
from src.folders.models import Folder
from src.lessons.models import Lesson
from src.playlists.models import Playlist
from src.payments.models import Subscription


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
            primary_key=True,
            autoincrement=True,
        )

    username: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    stripe_customer_id: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
    )

    google_sub: Mapped[str | None] = mapped_column(
        String,
        unique=True,
        nullable=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        String(320),
        unique=True,
        index=True,
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

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    subscription: Mapped["Subscription | None"] = relationship(
        "Subscription",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # lessons: Mapped[list["Lesson"]] = relationship(
    #     back_populates="author_user",
    #     cascade="all, delete-orphan",
    #     passive_deletes=True,
    # )

    # playlists: Mapped[list["Playlist"]] = relationship(
    #     back_populates="author_user",
    #     cascade="all, delete-orphan",
    #     passive_deletes=True,
    # )

    # folders: Mapped[list["Folder"]] = relationship(
    #     back_populates="user",
    #     cascade="all, delete-orphan",
    #     passive_deletes=True,
    # )
