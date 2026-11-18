from typing import Annotated

from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    status,
    Depends,
    HTTPException,
    Request,
    Response,
)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from src.database import get_db
from src.auth.security import (
    create_access_token,
    get_password_hash,
    verify_password,
    verify_email_verification_token,
    verify_refresh_token,
    create_refresh_token,
    revoke_refresh_token,
    create_password_reset_token,
    verify_password_reset_token,
    create_email_verification_token,
    set_refresh_cookie,
    oauth, get_client_ip,
)
from src.auth.limits import check_auth_limit
from src.worker.tasks import (
    send_verification_email_task,
    send_password_reset_email_task,
)
from src.auth.schemas import (
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResendVerificationRequest,
)
from src.users.models import User
from src.users import service
from src.config import settings
from src.users.schemas import UserResponse, UserCreate


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


DbSession = Annotated[
    Session,
    Depends(get_db),
]


@router.get("/status")
def auth_status():
    return {
        "status": "ok",
    }


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_token(
    request: Request,
    response: Response,
):
    token = request.cookies.get(
        "refresh_token"
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    payload = verify_refresh_token(token)

    revoke_refresh_token(payload)

    user_id = int(payload["sub"])

    access_token = create_access_token(
        {
            "sub": str(user_id),
        }
    )

    new_refresh_token = create_refresh_token(
        user_id
    )

    set_refresh_cookie(
        response,
        new_refresh_token,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    request: Request,
    data: UserCreate,
    db: DbSession,
):
    ip = get_client_ip(request)

    check_auth_limit(
        key=f"auth:register:{ip}",
        limit=5,
        ttl=600,
    )

    user_exist = service.get_by_email(
        db,
        data.email,
    )

    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with email provided exists already.",
        )

    user = service.create(
        db,
        data,
    )

    token = create_email_verification_token(
        user.id
    )

    send_verification_email_task.delay(
        user.email,
        token,
    )

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: Request,
    response: Response,
    data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    db: DbSession,
):

    ip = get_client_ip(request)

    check_auth_limit(
        key=f"auth:login:{ip}:{data.username}",
        limit=10,
        ttl=300,
    )
    user = service.get_by_username(
        db,
        data.username,
    )

    if (
        not user
        or not user.password_hash
        or not verify_password(
            data.password,
            user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email is not verified",
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
        }
    )

    refresh_token = create_refresh_token(
        user.id
    )

    set_refresh_cookie(
        response,
        refresh_token,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(
    request: Request,
    response: Response,
):
    token = request.cookies.get(
        "refresh_token"
    )

    if token:
        try:
            payload = verify_refresh_token(
                token
            )

            revoke_refresh_token(
                payload
            )

        except Exception:
            pass

    response.delete_cookie(
        key="refresh_token",
        path="/auth",
    )


@router.post("/forgot-password")
def forgot_password(
    request: Request,
    data: ForgotPasswordRequest,
    db: DbSession,
):
    ip = get_client_ip(request)

    check_auth_limit(
        key=f"auth:forgot-password:{ip}",
        limit=5,
        ttl=600,
    )

    user = service.get_by_email(
        db,
        data.email,
    )

    if user:
        token = create_password_reset_token(
            user.id
        )

        send_password_reset_email_task.delay(
            user.email,
            token,
        )

    return {
        "message": (
            "If the email exists, "
            "a reset link was sent"
        )
    }


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: DbSession,
):
    payload = verify_password_reset_token(
        data.token
    )

    user_id = int(
        payload["sub"]
    )

    user = db.get(
        User,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid reset token",
        )

    user.password_hash = get_password_hash(
        data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully",
    }


@router.get("/verify-email")
def verify_email(
    token: str,
    db: DbSession,
):
    payload = verify_email_verification_token(
        token
    )

    user = db.get(
        User,
        int(payload["sub"]),
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification token",
        )

    if user.is_verified:
        return {
            "message": "Email already verified",
        }

    user.is_verified = True

    db.commit()

    return {
        "message": "Email verified successfully",
    }


@router.post("/resend-verification")
def resend_verification(
    request: Request,
    data: ResendVerificationRequest,
    db: DbSession,
):
    ip = get_client_ip(request)

    check_auth_limit(
        key=f"auth:resend-verification:{ip}",
        limit=5,
        ttl=600,
    )
    user = service.get_by_email(
        db,
        data.email,
    )

    if user and not user.is_verified:
        token = create_email_verification_token(
            user.id
        )

        send_verification_email_task.delay(
            user.email,
            token,
        )

    return {
        "message": (
            "If the account exists and is not verified, "
            "a verification email was sent"
        )
    }


@router.get("/google")
async def auth_google(
    request: Request,
):
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri=(
            f"{settings.backend_url}"
            "/auth/google/callback"
        ),
    )


@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: DbSession,
):
    token = await oauth.google.authorize_access_token(
        request
    )

    user_info = token["userinfo"]

    if not user_info.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google email is not verified",
        )

    user = service.get_or_create_google_user(
        db=db,
        user_info=user_info,
    )

    refresh_token = create_refresh_token(
        user.id
    )

    response = RedirectResponse(
        url=(
            f"{settings.frontend_url}"
            "/auth/google/callback"
        )
    )

    set_refresh_cookie(
        response,
        refresh_token,
    )

    return response