from fastapi import APIRouter
from typing import Annotated
from src.generation import service as generation_service
from src.lessons import service as lesson_service
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session
from src.generation.models import GenerationJob
from uuid import uuid4
from src.generation.enums import GenerationStatus
from src.generation.helpers import get_random_phrases
from src.generation.client import (
    GroqAPIError,
    GroqRateLimitError,
)
from src.worker.tasks import generate_lesson_task
from src.generation.config import TARGET_LESSON_PHRASES
from src.database import get_db
from src.auth.dependencies import CurrentUser
from src.lessons.schemas import (LessonPhraseResponse)
from src.generation.schemas import (
    LessonGenerationRequest,
    PhraseGenerationError,
    MissingGrammarError,
    LessonGenerationResponse,
    GenerationTaskResponse
)
from src.generation.limits import (
    check_user_limits,
    get_generation_lock,
)
from src.storage import get_file_url

router = APIRouter(
    prefix="/generation",
    tags=["Generation"],
)

DbSession = Annotated[
    Session,
    Depends(get_db),
]

@router.get("/status")
def generation_status():
    return {
        "status": "ok"
    }

@router.get("/jobs/{job_id}")
def get_job(
    job_id: int,
    db: DbSession,
    current_user: CurrentUser,
):
    check_user_limits(
        current_user.id
    )

    job = generation_service.get_by_id(
        db=db,
        job_id=job_id,
        user_id=current_user.id,
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Generation job is not found",
        )
    
    return {
        "id": job.id,
        "task_id": job.task_id,
        "lesson_id": job.lesson_id,
        "status": job.status,
        "error": job.error

    }

@router.post(
    "/lessons/{lesson_id}",
    status_code=202,
    response_model=GenerationTaskResponse
)
def generate_lesson(
    lesson_id: int,
    data: LessonGenerationRequest,
    db: DbSession,
    current_user: CurrentUser,
):
    check_user_limits(
        current_user.id
    )

    lesson = lesson_service.get_by_id(
        db=db,
        lesson_id=lesson_id,
        user_id=current_user.id,
    )

    if lesson is None:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )
    generation_jobs = generation_service.get_all(db=db, user_id=current_user.id)

    active_statuses = {
        GenerationStatus.GENERATING_PDF.value,
        GenerationStatus.GENERATING_AUDIO.value,
        GenerationStatus.RETRYING.value,
        GenerationStatus.QUEUED.value,
        GenerationStatus.GENERATING_PHRASES.value,
    }
    existing_job = next(
        (
            job
            for job in generation_jobs
            if (
                job.status in active_statuses
                and job.lesson_id == lesson_id
            )
        ),
        None,
    )
    if existing_job:
        raise HTTPException(409)

    task_id = str(uuid4())

    job = GenerationJob(
        task_id=task_id,
        user_id=current_user.id,
        lesson_id=lesson.id,
        status="queued",
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    try:
        generate_lesson_task.apply_async(
            kwargs={
                "job_id": job.id,
                "user_id": current_user.id,
                "generation_type": data.type.value,
                "phrase_count": data.phrase_count,
            },
            task_id=task_id,
        )
    except Exception as exc:
        job.status = "failed"
        job.error = exc

        db.commit()

        raise HTTPException(
            status_code=503,
            detail="Failed to queue generation task",
        )


    return {
        "job_id": job.id,
        "lesson_id": lesson.id,
        "task_id": job.task_id,
        "status": job.status,
    }


@router.post(
    "/lessons/{lesson_id}/phrases",
    response_model_exclude_none=True,
    response_model=LessonGenerationResponse,
)
def generate_lesson_phrases(
    lesson_id: int,
    data: LessonGenerationRequest,
    db: DbSession,
    current_user: CurrentUser
):
    check_user_limits(
        current_user.id
    )

    lock = get_generation_lock(
        user_id=current_user.id,
        lesson_id=lesson_id,
    )
    try:

        lesson = lesson_service.get_by_id(
            db=db,
            lesson_id=lesson_id,
            user_id=current_user.id,
        )

        if lesson is None:
            raise HTTPException(
                status_code=404,
                detail="Lesson not found",
            )
        new_phrases, phrases = generation_service.generate_phrases_for_lesson(
            db=db,
            data=data,
            lesson=lesson,
        )

        if phrases is None:
            raise HTTPException(
                status_code=404,
                detail="Lesson not found",
            )

        return {
            "lesson": lesson,
            "new_phrases": [LessonPhraseResponse.model_validate(phrase) for phrase in new_phrases],
            "phrases": [LessonPhraseResponse.model_validate(phrase) for phrase in phrases],
        }

    except MissingGrammarError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except GroqRateLimitError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "AI generation is "
                "temporarily rate limited"
            ),
        ) from exc

    except PhraseGenerationError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except GroqAPIError as exc:
        raise HTTPException(
            status_code=502,
            detail="AI provider error",
        ) from exc
    finally:
        if lock.owned():
            lock.release()


@router.post(
    "/lessons/{lesson_id}/audio",
    response_model_exclude_none=True,
    response_model=LessonGenerationResponse
)
def generate_lesson_audio(
    lesson_id: int,
    db: DbSession,
    current_user: CurrentUser
):
    check_user_limits(
        current_user.id
    )

    lock = get_generation_lock(
        user_id=current_user.id,
        lesson_id=lesson_id,
    )
    try:

        lesson = lesson_service.get_by_id(
            db=db,
            lesson_id=lesson_id,
            user_id=current_user.id,
        )

        if lesson is None:
            raise HTTPException(
                status_code=404,
                detail="Lesson not found",
            )

        if len(lesson.phrases) < 1:
            raise HTTPException(
                status_code=404,
                detail="No phrases for lesson",
            )
        
        generation_service.build_audio(db=db, lesson=lesson, phrases=lesson.phrases)

        return {
            "lesson": lesson,
            "audio_url": get_file_url(lesson.audio_key)
        }

    except MissingGrammarError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except GroqRateLimitError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "AI generation is "
                "temporarily rate limited"
            ),
        ) from exc

    except PhraseGenerationError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except GroqAPIError as exc:
        raise HTTPException(
            status_code=502,
            detail="AI provider error",
        ) from exc
    finally:
        if lock.owned():
            lock.release()


@router.post(
    "/lessons/{lesson_id}/pdf",
    response_model_exclude_none=True,
    response_model=LessonGenerationResponse
)
def generate_lesson_pdf(
    lesson_id: int,
    db: DbSession,
    current_user: CurrentUser
):
    check_user_limits(
        current_user.id
    )

    lock = get_generation_lock(
        user_id=current_user.id,
        lesson_id=lesson_id,
    )
    try:

        lesson = lesson_service.get_by_id(
            db=db,
            lesson_id=lesson_id,
            user_id=current_user.id,
        )

        if lesson is None:
            raise HTTPException(
                status_code=404,
                detail="Lesson not found",
            )

        if len(lesson.phrases) < 1:
            raise HTTPException(
                status_code=404,
                detail="No phrases for lesson",
            )
        phrases = get_random_phrases(lesson, 50)
        generation_service.build_pdf(db=db, lesson=lesson, phrases=phrases)

        return {
            "lesson": lesson,
            "pdf_url": get_file_url(lesson.pdf_key)
        }

    except MissingGrammarError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except GroqRateLimitError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "AI generation is "
                "temporarily rate limited"
            ),
        ) from exc

    except PhraseGenerationError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except GroqAPIError as exc:
        raise HTTPException(
            status_code=502,
            detail="AI provider error",
        ) from exc
    finally:
        if lock.owned():
            lock.release()
