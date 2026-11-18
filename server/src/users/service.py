from sqlalchemy import select
from sqlalchemy.orm import Session
from src.users.models import User
from src.auth.security import get_password_hash, verify_password
from src.users.schemas import UserCreate, UserResponse
from fastapi import status, HTTPException


def get_all(db: Session) -> list[User]:
    statement = select(User)

    return list(
        db.scalars(statement).all()
    )


def get_by_username(
    db: Session,
    username: str,
) -> User | None:
    statement = select(User).where(User.username == username)

    return db.scalar(statement)


def get_by_email(
    db: Session,
    email: str,
) -> User | None:
    statement = select(User).where(
        User.email == email.lower()
    )

    return db.scalar(statement)


def get_or_create_google_user(
    db: Session,
    user_info: dict,
) -> User:
    email = user_info["email"]
    google_sub = user_info["sub"]

    user = db.scalar(
        select(User).where(
            User.google_sub == google_sub
        )
    )

    if user:
        return user

    user = get_by_email(
        db,
        email,
    )

    if user:
        user.google_sub = google_sub
        user.is_verified = True

        db.commit()
        db.refresh(user)

        return user

    username = f"{email.split('@')[0]}_{user_info['sub'][-6:]}"

    user = User(
        email=email,
        username=username,
        password_hash=None,
        google_sub=google_sub,
        is_verified=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def create(
    db: Session,
    data: UserCreate,
) -> User:
    user = User(
        username=data.username,
        email=data.email,
        password_hash=get_password_hash(data.password),
    )


    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login(
    data: UserCreate,
) -> User:
    user_exist = User.find_one(User.email == data.email)
    if not user_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with email does not exist."
        )

    if not user_exist.password_hash:
        raise HTTPException(
            status_code=400,
            detail="Use Google to sign in",
        )

    if verify_password(data.password, user_exist.password):
        return {"message": "User signed in successfully."}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid details passed."
    )