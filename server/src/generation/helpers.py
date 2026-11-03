from src.lessons.models import Lesson
from src.lessons.schemas import LessonPhrase
import random


def make_slow_phrase(
    phrase: str,
) -> str:
    return "... ".join(
        phrase.split()
    )


def normalize_phrase(
    phrase: str,
) -> str:
    return " ".join(
        phrase.lower().split()
    )


def get_random_phrases(
    lesson: Lesson,
    count: int,
) -> list[LessonPhrase]:
    phrases = list(
        lesson.phrases
    )

    return random.sample(
        phrases,
        k=min(
            count,
            len(phrases),
        ),
    )
