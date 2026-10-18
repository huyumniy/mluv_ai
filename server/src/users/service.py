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
    db: Session,
    data: UserCreate,
) -> User:
    user_exist = User.find_one(User.email == data.email)

    if not user_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with email does not exist."
        )

    if verify_password(data.password, user_exist.password):
        return {"message": "User signed in successfully."}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid details passed."
    )