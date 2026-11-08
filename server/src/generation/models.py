from sqlalchemy import DateTime, String, Text, func, ForeignKey
from src.database import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column

class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)

    task_id: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"),
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String,
        default="queued",
    )

    error: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )