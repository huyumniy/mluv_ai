from src.worker.celery_app import app
from src.database import SessionLocal
from src.lessons import service as lesson_service
from src.generation import service as generation_service
from src.generation.schemas import LessonGenerationRequest, PhraseGenerationError
from src.generation.enums import GenerationStatus
from src.generation.client import GroqAPIError, GroqRateLimitError
from src.generation.models import GenerationJob
from src.config import settings
from src.email.service import send_email
from src.users.models import User


@app.task(
    autoretry_for=(
        GroqRateLimitError,
        GroqAPIError,
        PhraseGenerationError,
    ),
    retry_kwargs={
        "max_retries": 3,
    },
    retry_backoff=30,
)
def generate_lesson_task(
    job_id: int,
    user_id: int,
    generation_type: str,
    phrase_count: int,
):
    db = SessionLocal()

    try:
        job = generation_service.get_by_id(
            db=db,
            job_id=job_id,
            user_id=user_id,
        )
        if job is None:
            raise ValueError(
                f"Generation job {job_id} is not found"
            )

        lesson = lesson_service.get_by_id(
            db=db,
            lesson_id=job.lesson_id,
            user_id=user_id,
        )
        if lesson is None:
            raise ValueError(
                f"Lesson {job.lesson_id} not found"
            )

        data = LessonGenerationRequest(
            type=generation_type,
            phrase_count=phrase_count,
        )

        def update_stage(
            status: GenerationStatus,
        ):
            job.status = status.value
            job.error = None
            db.commit()

        generation_service.generate_lesson(
            db=db,
            data=data,
            lesson=lesson,
            on_stage=update_stage,
        )

        job.status = GenerationStatus.SUCCESS.value
        job.error = None

        db.commit()

        return {
            "job_id": job.id,
            "lesson_id": lesson.id,
        }
    
    except (
            GroqRateLimitError,
            GroqAPIError,
            PhraseGenerationError,
        ):
            db.rollback()
            raise
    
    except Exception as exc:
        db.rollback()

        job = db.get(
            GenerationJob,
            job_id,
        )

        if job:
            job.status = GenerationStatus.FAILED.value
            job.error = str(exc)
            db.commit()

        raise

    finally:
        db.close()


@app.task(
    autoretry_for=(
        Exception,
    ),
    retry_kwargs={
        "max_retries": 3,
    },
    retry_backoff=True,
)
def send_verification_email_task(
    email: str,
    token: str,
):
    verification_url = (
        f"{settings.backend_url}"
        f"/auth/verify-email?token={token}"
    )

    send_email(
        to=email,
        subject="Verify your Mluv account",
        html=f"""
        <h2>Welcome to Mluv</h2>

        <p>Please verify your email address.</p>

        <a href="{verification_url}">
            Verify email
        </a>
        """,
    )


@app.task(
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_password_reset_email_task(
    email: str,
    token: str,
):
    url = (
        f"{settings.backend_url}"
        f"/reset-password?token={token}"
    )

    send_email(
        to=email,
        subject="Reset your Mluv password",
        html=f"""
        <h2>Reset your password</h2>
        <p>Click below to set a new password.</p>
        <a href="{url}">Reset password</a>
        <p>This link expires in 30 minutes.</p>
        """,
    )
