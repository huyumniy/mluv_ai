from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.folders.models import Folder
from src.lessons.models import Lesson

def get_folders_by_slugs(
    db: Session,
    folder_ids: list[str],
) -> list[Folder]:
    if not folder_ids:
        return []

    folders = list(
        db.scalars(
            select(Folder).where(
                Folder.slug.in_(folder_ids)
            )
        ).all()
    )

    found_ids = {
        folder.slug
        for folder in folders
    }

    missing_ids = [
        folder_id
        for folder_id in folder_ids
        if folder_id not in found_ids
    ]

    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail={
                "message": "Some folders do not exist",
                "folderIds": missing_ids,
            },
        )

    return folders


def get_lessons_by_slugs(
    db: Session,
    lesson_ids: list[str],
) -> list[Lesson]:
    if not lesson_ids:
        return []

    lessons = list(
        db.scalars(
            select(Lesson).where(
                Lesson.slug.in_(lesson_ids)
            )
        ).all()
    )

    lessons_by_slug = {
        lesson.slug: lesson
        for lesson in lessons
    }

    missing = [
        slug
        for slug in lesson_ids
        if slug not in lessons_by_slug
    ]

    if missing:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail={
                    "message": "Lesson does not exist",
                    "lesson_ids": lesson_ids,
                },
            )

    return [
        lessons_by_slug[slug]
        for slug in lesson_ids
    ]