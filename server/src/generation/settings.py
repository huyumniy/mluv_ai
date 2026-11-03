from dotenv import load_dotenv
import os
from pathlib import Path

ALGORITHM = """
You are generating Czech learning sentences.

Generate exactly {COUNT} unique sentences.

GRAMMAR:
{GRAMMAR_RULES}

CEFR LEVEL:
{LEVEL}

ALREADY USED CZECH SENTENCES:
{EXISTING_SENTENCES}

Rules:
- Every sentence must correctly use the specified grammar.
- Vocabulary must be appropriate for the specified CEFR level.
- Czech sentences must sound natural.
- Do not use final punctuation.
- Do not repeat or closely paraphrase already used sentences.
- Ukrainian and Czech sentences must have the same meaning.
- Keep explicit subjects and pronouns when reasonably possible.
"""

GROQ_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
]

BATCH_SIZE = 10

TARGET_LESSON_PHRASES = 50

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()

FONT_PATH = os.path.join(BASE_DIR, "fonts", "dejavu-fonts-ttf-2.37/ttf/DejaVuSans.ttf")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

CACHE_DIR = "audio_cache"
VOICE_ID = {
   "Ellen": "BIvP0GN1cAtSRTxNHnWS",
   "Anet": "MpbYQvoTmXjHkaxtLiSh",
   "Jan": "7FpO7yFcBAfqM6vZJCg7",
   "Spuds Oxley": "NOpBlnGInO9m6vDvFkFC"
}


ELEVENLABS_MODEL_ID = "eleven_v3"

os.makedirs(CACHE_DIR, exist_ok=True)
