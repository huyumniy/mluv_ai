from sqlalchemy import select
from sqlalchemy.orm import Session

from src.lessons.models import Lesson
from src.lessons.schemas import (
    LessonCreate,
    LessonUpdate
)


def get_all(db: Session) -> list[Lesson]:
    statement = select(Lesson)

    return list(
        db.scalars(statement).all()
    )


def get_by_id(
    db: Session,
    lesson_id: int,
) -> Lesson | None:
    return db.get(
        Lesson,
        lesson_id,
    )


def create(
    db: Session,
    data: LessonCreate,
) -> Lesson:
    lesson = Lesson(
        title=data.title,
        description=data.description,
        topic=data.topic,
        level=data.level,
    )

    db.add(lesson)
    db.commit()
    db.refresh(lesson)

    return lesson


def update(
    db: Session,
    lesson: Lesson,
    data: LessonUpdate,
) -> Lesson:
    values = data.model_dump(
        exclude_unset=True,
        
    )

    for field, value in values.items():
        setattr(
            lesson,
            field,
            value,
        )

    db.commit()
    db.refresh(lesson)

    return lesson


def delete(
    db: Session,
    lesson: Lesson,
) -> None:
    db.delete(lesson)
    db.commit()