from sqlalchemy import select
from sqlalchemy.orm import Session
from slugify import slugify
from src.playlists.models import Playlist
from src.storage import get_file_url
from src.helpers import get_folders_by_slugs, get_lessons_by_slugs
from src.playlists.models import Playlist
from src.playlists.schemas import (
    PlaylistCreate,
    PlaylistUpdate
)
from src.playlists.schemas import PlaylistResponse
from src.lessons.models import Lesson
from src.playlists.models import (
    Playlist,
    PlaylistLesson,
)

def to_response(
    playlist: Playlist,
) -> PlaylistResponse:
    print(playlist.playlist_lessons)
    return PlaylistResponse(
        id=playlist.id,
        slug=playlist.slug,

        title=playlist.title,
        description=playlist.description,
        topic=playlist.topic,

        image_url=get_file_url(
            playlist.image_key,
        ),

        created_at=playlist.created_at,
        updated_at=playlist.updated_at,

        lesson_ids=[
            item.lesson.slug
            for item in playlist.playlist_lessons
        ],

        folder_ids=[
            folder.slug
            for folder in playlist.folders
        ],
    )

def get_all(db: Session) -> list[Playlist]:
    statement = select(Playlist)

    return list(
        db.scalars(statement).all()
    )


def get_by_id(
    db: Session,
    playlist_id: int,
) -> Playlist | None:
    return db.get(
        Playlist,
        playlist_id,
    )


def create(
    db: Session,
    data: PlaylistCreate,
) -> Playlist:
    playlist = Playlist(
        title=data.title,
        description=data.description,
        topic=data.topic,
        slug=slugify(data.title)
    )

    if data.folder_ids is not None:
        playlist.folders = get_folders_by_slugs(
            db,
            data.folder_ids,
        )

    lessons = get_lessons_by_slugs(
        db,
        data.lesson_ids,
    )

    set_playlist_lessons(
        playlist,
        lessons,
    )

    db.add(playlist)
    db.commit()
    db.refresh(playlist)

    return playlist


def update(
    db: Session,
    playlist: Playlist,
    data: PlaylistUpdate,
) -> Playlist:
    values = data.model_dump(
        exclude_unset=True,
            exclude={
            "folder_ids",
            "lesson_ids",
        },
        
    )

    for field, value in values.items():
        setattr(
            playlist,
            field,
            value,
        )

    if data.folder_ids is not None:
        playlist.folders = get_folders_by_slugs(
            db,
            data.folder_ids,
        )

    if data.lesson_ids is not None:
        lessons = get_lessons_by_slugs(
            db,
            data.lesson_ids,
        )

        set_playlist_lessons(
            playlist,
            lessons,
        )

    db.commit()
    db.refresh(playlist)

    return playlist


def delete(
    db: Session,
    playlist: Playlist,
) -> None:
    db.delete(playlist)
    db.commit()


def set_playlist_lessons(
    playlist: Playlist,
    lessons: list[Lesson],
) -> None:
    playlist.playlist_lessons = [
        PlaylistLesson(
            lesson=lesson,
            position=index,
        )
        for index, lesson in enumerate(lessons)
    ]