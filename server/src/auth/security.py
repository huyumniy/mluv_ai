import os
from pathlib import Path
from fastapi import HTTPException, status, Response
from datetime import (
    datetime,
    timedelta,
    timezone,
)
from src.config import settings
import jwt
from jwt import PyJWTError, ExpiredSignatureError
from dotenv import load_dotenv 
from pwdlib import PasswordHash
from uuid import uuid4
from redis import Redis
from authlib.integrations.starlette_client import OAuth


password_hasher = PasswordHash.recommended()
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv()

SECRET_KEY = os.environ["SECRET_KEY"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180
REFRESH_TOKEN_EXPIRE_DAYS = 30
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = 30
EMAIL_VERIFICATION_EXPIRE_HOURS = 24

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.environ['GOOGLE_CLIENT_ID'],
    client_secret=os.environ['GOOGLE_CLIENT_SECRET'],
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params={"scope": "openid email profile"},
    access_token_url="https://oauth2.googleapis.com/token",
    client_kwargs={"scope": "openid email profile"},
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration"
)



redis = Redis.from_url(
    os.environ["REDIS_URL"]
)

def set_refresh_cookie(
    response: Response,
    refresh_token: str,
):
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=not settings.debug,
        samesite="lax",
        max_age=60 * 60 * 24 * 30,
        path="/auth",
    )

def get_client_ip(request) -> str:
    if request.client:
        return request.client.host

    return "unknown"


def is_refresh_token_revoked(
    jti: str,
) -> bool:
    return bool(redis.exists(f"auth:refresh:{jti}"))


def revoke_refresh_token(
    payload: dict,
):
    jti = payload["jti"]
    exp = payload["exp"]

    now = int(datetime.now(timezone.utc).timestamp())

    ttl = exp - now

    if ttl > 0:
        redis.setex(f"auth:refresh:{jti}", ttl ,"revoked")


def verify_password(plain_password, hashed_password):
    return password_hasher.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hasher.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(user_id: int):
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "jti": str(uuid4()),
        "iat": now,
        "exp": now + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        ),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def decode_token(
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
        data = decode_token(token)

        if data.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        return data
    
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        ) from None


def verify_refresh_token(
    token: str,
) -> dict:
    try:
        data = decode_token(token)

        if data.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        if not data.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        jti = data.get("jti")

        if not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        if is_refresh_token_revoked(jti):
            raise HTTPException(
                status_code=401,
                detail="Refresh token revoked",
            )

        return data

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired",
        ) from None

    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from None


def create_password_reset_token(
    user_id: int,
) -> str:
    now = datetime.now(timezone.utc)

    payload = {"sub": str(user_id),"type": "password_reset", "iat": now, "exp": now + timedelta(
            minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
        ),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def verify_password_reset_token(
    token: str,
) -> dict:
    try:
        data = decode_token(token)

        if data.get("type") != "password_reset":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type",
            )

        if not data.get("sub"):
            raise HTTPException(
                status_code=401,
                detail="Invalid reset token",
            )

        return data

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Reset token expired",
        ) from None

    except PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid reset token",
        ) from None


def create_email_verification_token(
    user_id: int,
) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "type": "email_verification",
        "iat": now,
        "exp": now + timedelta(
            hours=EMAIL_VERIFICATION_EXPIRE_HOURS
        ),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def verify_email_verification_token(
    token: str,
) -> dict:
    try:
        data = decode_token(token)

        if data.get("type") != "email_verification":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type",
            )

        if not data.get("sub"):
            raise HTTPException(
                status_code=401,
                detail="Invalid verification token",
            )

        return data

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Verification token expired",
        ) from None

    except PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid verification token",
        ) from None