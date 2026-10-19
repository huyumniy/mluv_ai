from typing import Annotated
from fastapi_pagination import Page, paginate


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,

)
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.dependencies import CurrentUser
from src.folders import service
from src.folders.schemas import (
    FolderCreate,
    FolderResponse,
    FolderUpdate,
)


router = APIRouter(
    prefix="/folders",
    tags=["Folders"],
)


@router.get("/status")
def folders_status():
    return {
        "status": "ok"
    }

DbSession = Annotated[
    Session,
    Depends(get_db),
]


@router.get(
    "/",
    response_model=Page[FolderResponse],
)
def get_folders(
    db: DbSession,
    current_user: CurrentUser
):
    folders = service.get_all(db, current_user.id)
    return paginate(folders)


@router.get(
    "/{folder_id}",
    response_model=FolderResponse,
)
def get_folder(
    folder_id: str,
    db: DbSession,
    current_user: CurrentUser
):
    folder = service.get_by_slug(
        db,
        folder_id,
        current_user.id
    )

    if not folder:
        raise HTTPException(
            status_code=404,
            detail="Folder not found",
        )

    return service.to_response(folder)


@router.post(
    "/",
    response_model=FolderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_folder(
    data: FolderCreate,
    db: DbSession,
    current_user: CurrentUser
):
    result = service.create(
        db,
        data,
        current_user.id
    )

    return service.to_response(result)


@router.patch(
    "/{folder_id}",
    response_model=FolderResponse,
)
def update_folder(
    folder_id: str,
    data: FolderUpdate,
    db: DbSession,
    current_user: CurrentUser
):
    folder = service.get_by_slug(
        db,
        folder_id,
        current_user.id
    )

    if not folder:
        raise HTTPException(
            status_code=404,
            detail="Folder not found",
        )

    result = service.update(
        db,
        folder,
        data,
    )

    return service.to_response(result)


@router.delete(
    "/{folder_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_folder(
    folder_id: str,
    db: DbSession,
    current_user: CurrentUser
):
    folder = service.get_by_slug(
        db,
        folder_id,
        current_user.id
    )

    if not folder:
        raise HTTPException(
            status_code=404,
            detail="Folder not found",
        )

    service.delete(
        db,
        folder,
    )
