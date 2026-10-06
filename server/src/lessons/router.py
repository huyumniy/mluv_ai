from typing import Annotated, List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from src.database import get_db
from src.lessons import service
from src.lessons.schemas import (
    LessonCreate,
    LessonResponse,
    LessonUpdate,
)

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"],
)

@router.get("/status")
def lessons_status():
    return {
        "status": "ok"
    }

DbSession = Annotated[
    Session,
    Depends(get_db),
]

@router.get(
    "/",
    response_model=List[LessonResponse],
)
def get_lessons(
    db: DbSession,
):
    return service.get_all(db)


@router.get(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def get_lesson(
    lesson_id: int,
    db: DbSession,
):
    lesson = service.get_by_id(
        db,
        lesson_id,
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    return lesson

@router.post(
    "/",
    response_model=LessonResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lesson(
    data: LessonCreate,
    db: DbSession,
):
    return service.create(
        db,
        data,
    )


@router.patch(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def update_lesson(
    lesson_id: int,
    data: LessonUpdate,
    db: DbSession,
):
    lesson = service.get_by_id(
        db,
        lesson_id,
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    return service.update(
        db,
        lesson,
        data,
    )


@router.delete(
    "/{lesson_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_lesson(
    lesson_id: int,
    db: DbSession,
):
    lesson = service.get_by_id(
        db,
        lesson_id,
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    service.delete(
        db,
        lesson,
    )