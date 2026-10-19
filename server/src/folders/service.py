from sqlalchemy import select
from sqlalchemy.orm import Session
from slugify import slugify
from src.folders.models import Folder
from src.folders.schemas import (
    FolderCreate,
    FolderUpdate
)
from src.folders.schemas import FolderResponse


def to_response(
    folder: Folder,
) -> FolderResponse:
    return FolderResponse(
        id=folder.id,
        slug=folder.slug,

        name=folder.name,
        type=folder.type,
        color=folder.color,

        created_at=folder.created_at,
        updated_at=folder.updated_at,
    )


def get_all(db: Session, user_id: int) -> list[Folder]:
    statement = select(Folder).where(
        Folder.user_id == user_id
    )

    return list(
        db.scalars(statement).all()
    )

def get_by_slug(
    db: Session,
    slug: str,
    user_id: int,
) -> Folder | None:
    statement = select(Folder).where(
        Folder.slug == slug,
        Folder.user_id == user_id
    )

    return db.scalar(statement)


def create(
    db: Session,
    data: FolderCreate,
    user_id: int
) -> Folder:
    folder = Folder(
        name=data.name,
        slug=slugify(data.name),
        color=data.color,
        type=data.type,
        user_id=user_id,
    )

    db.add(folder)
    db.commit()
    db.refresh(folder)

    return folder


def update(
    db: Session,
    folder: Folder,
    data: FolderUpdate,
) -> Folder:
    values = data.model_dump(
        exclude_unset=True,
        
    )

    for field, value in values.items():
        setattr(
            folder,
            field,
            value,
        )

    db.commit()
    db.refresh(folder)

    return folder



def delete(
    db: Session,
    folder: Folder,
) -> None:
    db.delete(folder)
    db.commit()