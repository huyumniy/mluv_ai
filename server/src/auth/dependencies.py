from typing import Annotated

import jwt

from fastapi import (
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from src.auth.security import (
    verify_access_token,
)
from src.database import get_db
from src.users.models import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: Annotated[
        str,
        Depends(oauth2_scheme),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:
        payload = verify_access_token(
            token
        )

        user_id = int(
            payload["sub"]
        )

    except (
        jwt.InvalidTokenError,
        KeyError,
        ValueError,
    ):
        raise credentials_error

    user = db.get(
        User,
        user_id,
    )

    if not user:
        raise credentials_error

    return user


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]