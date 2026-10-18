from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class UserCreate(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    username: str = Field(
        min_length=2,
        max_length=100,
    )


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )