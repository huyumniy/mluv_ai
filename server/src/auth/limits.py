from fastapi import HTTPException, status

from src.generation.limits import redis


def check_auth_limit(
    key: str,
    limit: int,
    ttl: int,
):
    value = redis.incr(key)

    if value == 1:
        redis.expire(
            key,
            ttl,
        )

    if value > limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests",
        )
