from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from slugify import slugify
from src.lessons.models import Lesson
from src.lessons.schemas import (
    LessonCreate,
    LessonUpdate
)
from fastapi import UploadFile
from src.helpers import get_folders_by_slugs
from src.storage import save_file

from src.storage import get_file_url
from src.lessons.schemas import LessonResponse


def to_response(
    lesson: Lesson,
) -> LessonResponse:
    print(
        "LESSON:",
        lesson.id,
        "FOLDERS:",
        [
            folder.slug
            for folder in lesson.folders
        ],
    )
    return LessonResponse(
        id=lesson.id,
        slug=lesson.slug,

        title=lesson.title,
        description=lesson.description,
        topic=lesson.topic,
        level=lesson.level,

        duration_seconds=lesson.duration_seconds,
        phrase_count=lesson.phrase_count,

        status=lesson.status,

        image_url=get_file_url(
            lesson.image_key,
        ),
        audio_url=get_file_url(
            lesson.audio_key,
        ),
        pdf_url=get_file_url(
            lesson.pdf_key,
        ),

        folder_ids=[
            folder.slug
            for folder in lesson.folders
        ],

        created_at=lesson.created_at,
        updated_at=lesson.updated_at,
    )


def get_all(db: Session) -> list[Lesson]:
    statement = select(Lesson).options(selectinload(Lesson.folders))

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
        slug=slugify(data.title),
    )

    if data.folder_ids is not None:
        lesson.folders = get_folders_by_slugs(
            db,
            data.folder_ids,
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
        exclude={
            "folder_ids",
        },
        
    )

    for field, value in values.items():
        setattr(
            lesson,
            field,
            value,
        )

    if data.folder_ids is not None:
        lesson.folders = get_folders_by_slugs(
            db,
            data.folder_ids,
        )

    db.commit()
    db.refresh(lesson)

    return lesson


def update_files(
    db: Session,
    lesson: Lesson,
    image: UploadFile | None,
    audio: UploadFile | None,
    pdf: UploadFile | None,
) -> Lesson:

    if image:
        lesson.image_key = save_file(
            image,
            f"lessons/{lesson.id}",
        )

    if audio:
        lesson.audio_key = save_file(
            audio,
            f"lessons/{lesson.id}",
        )

    if pdf:
        lesson.pdf_key = save_file(
            pdf,
            f"lessons/{lesson.id}",
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