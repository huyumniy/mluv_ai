from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

def save_file(
    file: UploadFile,
    directory: str,
) -> str:
    extension = Path(
        file.filename or ""
    ).suffix.lower()

    filename = f"{uuid4()}{extension}"

    folder = UPLOAD_DIR / directory

    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

    path = folder / filename

    with path.open("wb") as output:
        while chunk := file.file.read(1024 * 1024):
            output.write(chunk)

    return f"{directory}/{filename}"


def get_file_url(
    key: str | None,
) -> str | None:
    if not key:
        return None

    return f"http://127.0.0.1:8000/media/{key}"