from typing import Annotated
from fastapi_pagination import Page, paginate

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    File,
    UploadFile,
    Path
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
    response_model=Page[LessonResponse],
)
def get_lessons(
    db: DbSession,
):
    lessons = service.get_all(db)
    return paginate([
        service.to_response(lesson)
        for lesson in lessons
    ])


@router.get(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def get_lesson(
    lesson_id: Annotated[int, Path(gt=0)],
    db: DbSession,
):
    lesson = service.get_by_id(
        db,
        lesson_id
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    return service.to_response(lesson)

@router.post(
    "/",
    response_model=LessonResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lesson(
    data: LessonCreate,
    db: DbSession,
):
    result = service.create(
        db,
        data,
    )

    return service.to_response(result)


@router.patch(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def update_lesson(
    lesson_id: Annotated[int, Path(gt=0)],
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

    result = service.update(
        db,
        lesson,
        data,
    )

    return service.to_response(result)


@router.patch(
    "/{lesson_id}/files",
    response_model=LessonResponse,
)
def update_lesson_files(
    lesson_id: Annotated[int, Path(gt=0)],
    db: DbSession,

    image: Annotated[
        UploadFile | None,
        File(),
    ] = None,

    audio: Annotated[
        UploadFile | None,
        File(),
    ] = None,

    pdf: Annotated[
        UploadFile | None,
        File(),
    ] = None,
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

    result = service.update_files(
        db,
        lesson,
        image=image,
        audio=audio,
        pdf=pdf,
    )

    return service.to_response(result)


@router.delete(
    "/{lesson_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_lesson(
    lesson_id: Annotated[int, Path(gt=0)],
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