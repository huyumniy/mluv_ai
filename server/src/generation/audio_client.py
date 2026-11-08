from elevenlabs.client import ElevenLabs
from src.generation.config import ELEVENLABS_API_KEY, ELEVENLABS_MODEL_ID

elevenlabs = ElevenLabs(api_key=ELEVENLABS_API_KEY)


def generate_audio_bytes(text: str, voice_id: str) -> bytes:
    audio_stream = elevenlabs.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=ELEVENLABS_MODEL_ID,
        output_format="mp3_44100_128",
    )

    return b"".join(audio_stream)
