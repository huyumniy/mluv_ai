import os

from fastapi import HTTPException
from redis import Redis
from pathlib import Path
from dotenv import load_dotenv 

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv()

redis = Redis.from_url(os.environ["REDIS_URL"])


def increment_limit(
    key: str,
    limit: int,
    ttl: int,
):
    value = redis.incr(key)

    if value == 1:
        redis.expire(key, ttl)

    if value > limit:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded",
        )


def check_user_limits(
    user_id: int,
):
    # 3 generation requests per minute
    increment_limit(
        key=f"generation:user:{user_id}:minute",
        limit=3,
        ttl=60,
    )

    # 30 generation requests per day
    increment_limit(
        key=f"generation:user:{user_id}:day",
        limit=30,
        ttl=86400,
    )


def check_groq_budget():
    # Protect the whole app from sending
    # too many requests to Groq.
    increment_limit(
        key="groq:requests:minute",
        limit=20,
        ttl=60,
    )


def get_generation_lock(
    user_id: int,
    lesson_id: int,
):
    return redis.lock(
        name=(
            f"generation:"
            f"user:{user_id}:"
            f"lesson:{lesson_id}"
        ),
        timeout=180,
        blocking=False,
    )