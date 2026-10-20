from typing import Annotated
from fastapi_pagination import Page, paginate

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session
from src.auth.dependencies import CurrentUser
from src.database import get_db
from src.playlists import service
from src.playlists.schemas import (
    PlaylistCreate,
    PlaylistResponse,
    PlaylistUpdate,
)

router = APIRouter(
    prefix="/playlists",
    tags=["Playlists"],
)

@router.get("/status")
def playlists_status():
    return {
        "status": "ok"
    }

DbSession = Annotated[
    Session,
    Depends(get_db),
]

@router.get(
    "/",
    response_model=Page[PlaylistResponse],
)
def get_playlists(
    db: DbSession,
    current_user: CurrentUser
):
    playlists = service.get_all(db, current_user.id)
    return paginate([
        service.to_response(playlist)
        for playlist in playlists
    ])


@router.get(
    "/{playlist_id}",
    response_model=PlaylistResponse,
)
def get_playlist(
    playlist_id: int,
    db: DbSession,
    current_user: CurrentUser
):
    playlist = service.get_by_id(
        db,
        playlist_id,
        current_user.id
    )

    if not playlist:
        raise HTTPException(
            status_code=404,
            detail="Playlist not found",
        )

    return service.to_response(playlist)

@router.post(
    "/",
    response_model=PlaylistResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_playlist(
    data: PlaylistCreate,
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
    "/{playlist_id}",
    response_model=PlaylistResponse,
)
def update_playlist(
    playlist_id: int,
    data: PlaylistUpdate,
    db: DbSession,
    current_user: CurrentUser
):
    playlist = service.get_by_id(
        db,
        playlist_id,
        current_user.id
    )

    if not playlist:
        raise HTTPException(
            status_code=404,
            detail="playlist not found",
        )

    result = service.update(
        db,
        playlist,
        data,
        current_user.id
    )

    return service.to_response(result)


@router.delete(
    "/{playlist_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_playlist(
    playlist_id: int,
    db: DbSession,
    current_user: CurrentUser
):
    playlist = service.get_by_id(
        db,
        playlist_id,
        current_user.id
    )

    if not playlist:
        raise HTTPException(
            status_code=404,
            detail="Playlist not found",
        )

    service.delete(
        db,
        playlist,
    )