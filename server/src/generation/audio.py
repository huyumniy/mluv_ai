from src.generation.config import CACHE_DIR

import os
import hashlib
from pydub import AudioSegment
from io import BytesIO
from src.generation.audio_client import generate_audio_bytes


def get_cache_path(text: str, lang: str) -> str:
    key_raw = f"{text.strip().lower()}|{lang}"
    key = hashlib.md5(key_raw.encode("utf-8")).hexdigest()
    return os.path.join(CACHE_DIR, f"{key}.mp3")


def is_cached(path: str) -> bool:
    return os.path.exists(path)


def save_cache(path: str, data: bytes):
    with open(path, "wb") as f:
        f.write(data)


def tts(text: str, voice_id, lang: str = "en", cache = True) -> AudioSegment:
    path = get_cache_path(text, lang)
    if cache and is_cached(path):
        return AudioSegment.from_file(path, format="mp3")
    print(f"Audio not found in cache. Generating new audio for text: '{text}'")
    audio_bytes = generate_audio_bytes(text, voice_id)
    if cache:
        save_cache(path, audio_bytes)

    return AudioSegment.from_file(BytesIO(audio_bytes), format="mp3")
