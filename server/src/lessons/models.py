from sqlalchemy import String, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base
from src.lessons.enums import LessonLevel

class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(
        primary_key=True,
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