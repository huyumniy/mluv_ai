import os
from pathlib import Path
from fastapi import HTTPException, status
from datetime import (
    datetime,
    timedelta,
    timezone,
)
import jwt
from jwt import PyJWTError
from dotenv import load_dotenv 
from pwdlib import PasswordHash


password_hasher = PasswordHash.recommended()
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv()

SECRET_KEY = os.environ["SECRET_KEY"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180


def verify_password(plain_password, hashed_password):
    return password_hasher.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hasher.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(
    token: str,
) -> dict:
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[
            JWT_ALGORITHM,
        ],
    )


def verify_access_token(token: str) -> dict:
    try:
        data = decode_access_token(token)
        expire = data.get("exp")

        if expire is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No access token supplied"
            )
        if datetime.now(timezone.utc) > datetime.fromtimestamp(expire, tz=timezone.utc,):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token expired!"
            )
        return data
    
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

