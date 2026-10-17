from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints
)
from src.folders.enums import FolderType
from typing import Annotated
from datetime import datetime

ColorType = Annotated[
    str,
    StringConstraints(
        pattern=r"^#[0-9A-Fa-f]{6}$",
    ),
]

class FolderBase(BaseModel):
    name: str = Field(
        min_length=3,
        max_length=64,
        description="Folder title",
        examples=["Work"],
    )

    color: ColorType = Field(
        description="HEX format color",
        examples=["#ffffff", "#ECB914"]
    )

    type: FolderType = Field(
            default=FolderType.CUSTOM,
            description="Possible folder types (SYSTEM, PREDEFINED, CUSTOM)",
        )

class FolderCreate(FolderBase):
    pass


class FolderUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=3,
        max_length=64,
    )

    color: ColorType | None = None

    type: FolderType | None = None



class FolderResponse(FolderBase):
    id: str = Field(
        validation_alias="slug",
    )
    created_at: datetime = Field(
        serialization_alias="createdAt",
    )

    updated_at: datetime = Field(
        serialization_alias="updatedAt",
    )

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

