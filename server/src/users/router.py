from typing import Annotated

from sqlalchemy.orm import Session

from fastapi import APIRouter, status, Depends, HTTPException
from src.database import get_db
from src.auth.dependencies import CurrentUser
from src.users.schemas import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

DbSession = Annotated[
    Session,
    Depends(get_db),
]

@router.get("/status")
def users_status():
    return {
        "status": "ok"
    }

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: CurrentUser,
):
    return current_user

