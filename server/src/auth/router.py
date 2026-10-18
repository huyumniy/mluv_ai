from typing import Annotated

from sqlalchemy.orm import Session

from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from src.database import get_db
from src.auth.security import create_access_token, get_password_hash, verify_password
from src.auth.schemas import TokenResponse
from src.users.models import User
from src.users import service
from src.auth.dependencies import CurrentUser
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
        "status": "ok"
    }


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(data: UserCreate, db: DbSession,):
    user_exist = service.get_by_email(db, data.email)
    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with email provided exists already."
        )
    result = service.create(
        db,
        data,
    )

    return result


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    db: DbSession
):
    user_exist = service.get_by_username(db, data.username)

    if (
        not user_exist
        or not verify_password(
            data.password,
            user_exist.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    access_token = create_access_token({"sub": str(user_exist.id)})
    return {
        "access_token": access_token,
        "token_type": "Bearer"
    }
