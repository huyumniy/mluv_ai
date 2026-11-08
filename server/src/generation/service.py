from sqlalchemy.orm import Session

from src.lessons.models import (
    Lesson,
    LessonPhrase
)
from src.generation.models import GenerationJob
from src.generation.schemas import (
    LessonGenerationRequest,
    GeneratedPhrase,
    GroqPhraseBatch,
    MissingGrammarError,
    PhraseGenerationError,
)
from .client import groq_chat_request
from sqlalchemy import func, select

from src.generation.config import (
    ALGORITHM,
    BATCH_SIZE,
    TARGET_LESSON_PHRASES,
    VOICE_ID
)
from sqlalchemy.orm import Session
from markdown import markdown
from weasyprint import HTML
from src.generation.enums import GenerationType
from src.generation.helpers import make_slow_phrase, normalize_phrase, get_random_phrases
from src.generation.audio import tts
from src.storage import get_lesson_directory
import random
import os
from random import choice
from pydub import AudioSegment
from collections.abc import Callable
from src.generation.enums import GenerationStatus


def get_all(
    db: Session,
    user_id: int,
) -> list[GenerationJob]:
    statement = select(GenerationJob) \
        .where(GenerationJob.user_id == user_id)

    return list(db.scalars(statement).all())


def get_by_id(
    db: Session,
    job_id: int,
    user_id: int,
) -> GenerationJob | None:
    statement = (
        select(GenerationJob)
        .where(
            GenerationJob.id == job_id,
            GenerationJob.user_id == user_id,
        )
    )

    return db.scalar(statement)


def generate_lesson(
    db: Session,
    data: LessonGenerationRequest,
    lesson: Lesson,
    on_stage: Callable[[GenerationStatus], None] | None = None,
) -> Lesson:
    def set_stage(status: GenerationStatus):
        if on_stage:
            on_stage(status)

    

    if len(lesson.phrases) < 50:
        fill_lesson_phrases(
            db=db,
            lesson=lesson,
        )
    set_stage(
        GenerationStatus.GENERATING_PHRASES
    )
    
    new_phrases, phrases = generate_phrases_for_lesson(
        db=db,
        data=data,
        lesson=lesson
    )

    set_stage(
        GenerationStatus.GENERATING_AUDIO
    )

    build_audio(
        db=db,
        lesson=lesson,
        phrases=lesson.phrases,
    )

    set_stage(
        GenerationStatus.GENERATING_PDF
    )

    build_pdf(
        db=db,
        lesson=lesson,
        new_phrases=new_phrases,
        phrases=phrases
    )

    return lesson


def generate_phrases_for_lesson(
    db: Session,
    data: LessonGenerationRequest,
    lesson: Lesson,
) -> tuple[
    list[LessonPhrase],
    list[LessonPhrase],
]:
    if len(lesson.phrases) < 50:
        fill_lesson_phrases(
            db=db,
            lesson=lesson,
            target_count=TARGET_LESSON_PHRASES,
        )

    if data.type == GenerationType.NEW:
        generated = generate_phrase_batch(
            lesson=lesson,
            count=data.phrase_count,
            level=lesson.level,
        )

        new_phrases = append_phrases(
            lesson,
            generated,
        )

        db.commit()

        old_phrases = [
            phrase
            for phrase in lesson.phrases
            if phrase not in new_phrases
        ]

        all_phrases = (
            new_phrases
            + random.sample(
                old_phrases,
                50 - len(new_phrases),
            )
        )

        random.shuffle(all_phrases)

        return (
            new_phrases,
            all_phrases,
        )

    if data.type == GenerationType.REPEAT:
        repeated_phrases = get_random_phrases(
            lesson,
            count=50,
        )

        return (
            [],
            repeated_phrases,
        )

    raise ValueError(
        f"Unsupported generation type: {data.type}"
    )


def generate_text(prompt: str, system: str = None) -> GroqPhraseBatch:
    messages = []

    if system:
        messages.append({"role": "system", "content": system})

    messages.append({"role": "user", "content": prompt})

    response = groq_chat_request(messages)

    try:
        content = response["choices"][0]["message"]["content"]

    except (KeyError,IndexError,TypeError) as exc:
        raise PhraseGenerationError("Invalid Groq response") from exc


    try:
        return (
            GroqPhraseBatch
            .model_validate_json(content)
        )
    except ValueError as exc:
        raise PhraseGenerationError(
            "Could not validate Groq response"
        ) from exc


def generate_phrase_batch(
    lesson: Lesson,
    count: int,
    level: str,
) -> list[GeneratedPhrase]:
    grammar = lesson.grammar

    if grammar is None:
        raise MissingGrammarError(
            "Lesson has no grammar assigned"
        )

    existing_cz = [
        phrase.original
        for phrase in lesson.phrases
    ]

    seen_cz = {
        normalize_phrase(phrase)
        for phrase in existing_cz
    }

    result: list[GeneratedPhrase] = []

    max_attempts = 3
    attempts = 0

    while (
        len(result) < count
        and attempts < max_attempts
    ):
        attempts += 1

        needed = (
            count
            - len(result)
        )

        already_used = (
            existing_cz
            + [
                phrase.original
                for phrase in result
            ]
        )

        prompt = ALGORITHM.format(
            COUNT=needed,
            GRAMMAR_RULES=(
                grammar.description
            ),
            LEVEL=level,
            EXISTING_SENTENCES=(
                "\n".join(
                    already_used
                )
            ),
        )

        generated = generate_text(
            prompt=prompt,
            system=(
                "You are a Czech "
                "language teacher."
            ),
        )

        for phrase in generated.phrases:
            translation = phrase.ua.strip()

            original = (
                phrase.cz
                .strip()
                .rstrip(".!?")
            )

            if (
                not translation
                or not original
            ):
                continue

            normalized = normalize_phrase(
                original
            )

            if normalized in seen_cz:
                continue

            result.append(
                GeneratedPhrase(
                    translation=translation,

                    original=original,

                    original_slowed=(
                        make_slow_phrase(
                            original
                        )
                    ),
                )
            )

            seen_cz.add(
                normalized
            )

            if len(result) == count:
                break

    if len(result) < count:
        raise PhraseGenerationError(
            f"Generated only "
            f"{len(result)}/{count} "
            f"unique phrases"
        )

    return result


def fill_lesson_phrases(
    db: Session,
    lesson: Lesson,
    target_count: int = (
        TARGET_LESSON_PHRASES
    ),
) -> Lesson:
    while (
        len(lesson.phrases)
        < target_count
    ):
        remaining = (
            target_count
            - len(lesson.phrases)
        )

        batch_size = min(
            remaining,
            BATCH_SIZE,
        )

        generated = generate_phrase_batch(
            lesson=lesson,
            count=batch_size,
            level=lesson.level,
        )

        append_phrases(
            lesson,
            generated,
        )

        db.commit()

    return lesson


def append_phrases(
    lesson: Lesson,
    generated_phrases: list[
        GeneratedPhrase
    ],
) -> list[LessonPhrase]:
    next_position = (
        max(
            (
                phrase.position
                for phrase
                in lesson.phrases
            ),
            default=-1,
        )
        + 1
    )

    new_phrases = [
        LessonPhrase(
            position=(
                next_position + index
            ),

            translation=(
                phrase.translation
            ),

            original=(
                phrase.original
            ),

            original_slowed=(
                phrase.original_slowed
            ),
        )

        for index, phrase
        in enumerate(
            generated_phrases
        )
    ]

    lesson.phrases.extend(
        new_phrases
    )

    return new_phrases


def build_audio(db: Session, lesson: Lesson, phrases: list[LessonPhrase], pause_ms: int = 5000):
    """
    Builds an audio file from a list of phrases
    each phrase is a dictionary with 'ua', 'cz', and 'cz_slow' keys

    returns the path to the generated audio file and the AudioSegment object.
    """

    voice_id = choice(list(VOICE_ID.values()))

    silence = AudioSegment.silent(duration=pause_ms)
    short_pause = AudioSegment.silent(duration=500)

    audio = AudioSegment.empty()

    # Intro sentence
    audio += tts(
        text=f"Тема: {lesson.topic}. Урок {lesson.topic_lesson_number}.",
        voice_id=voice_id,
        lang="ua",
        cache=False
    ) + silence

    for phrase in phrases:
        ua = tts(phrase.translation, voice_id, "ua")
        cz_slow = tts(phrase.original_slowed, voice_id, "cz")
        cz = tts(phrase.original, voice_id, "cz")

        audio += ua + silence
        audio += cz_slow + short_pause + cz + silence


    folder = get_lesson_directory(lesson.id)

    audio_path = (folder / f"audio.mp3")

    audio.export(str(audio_path),format="mp3",
)

    lesson.audio_key = (
        f"lessons/{lesson.id}/audio.mp3"
    )

    db.commit()
    db.refresh(lesson)

    return str(audio_path)


def build_html(topic: str, description: str, new_phrases_html=None, phrases_html=None):
    md_html = markdown(description, extensions=["tables"])

    new_phrases_section = f"""
        <div class="section">Нові речення</div>
        {new_phrases_html}
    """ if new_phrases_html else ""

    all_phrases_section = f"""
        <div class="section">Речення з уроку</div>
        {phrases_html}
    """ if phrases_html else ""

    html = f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: DejaVu Sans, sans-serif;
                padding: 20px;
            }}

            table {{
                border-collapse: collapse;
                width: 100%;
            }}

            th, td {{
                border: 1px solid #999;
                padding: 6px;
                text-align: center;
            }}

            th {{
                background: #eee;
            }}

            .section {{
                margin-top: 25px;
                font-size: 18px;
                font-weight: bold;
            }}

            .title {{
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }}
        </style>
    </head>

    <body>
        <div class="title">Тема: {topic}</div>

        <div class="section">Пояснення</div>
        {md_html}

        {new_phrases_section}

        {all_phrases_section}
    </body>
    </html>
    """

    return html


def build_table_html(phrases: list[LessonPhrase] | None = None):
    rows = [
        "<tr><th>#</th><th>Ukrainian</th><th>Czech</th></tr>"
    ]

    for i, w in enumerate(phrases, 1):
        rows.append(
            f"<tr><td>{i}</td><td>{w.translation}</td><td>{w.original}</td></tr>"
        )

    return f"<table>{''.join(rows)}</table>"


def generate_pdf(html, output_path):
    HTML(string=html).write_pdf(output_path)


def build_pdf(
    db: Session,
    lesson: Lesson, 
    new_phrases: list[LessonPhrase] | None = None, 
    phrases: list[LessonPhrase] | None = None
) -> str:
    folder = get_lesson_directory(lesson.id)

    pdf_path = (folder / f"lesson.pdf")

    new_words_html = None
    if new_phrases:
        new_words_html = build_table_html(new_phrases)
    old_phrases_html = build_table_html(phrases)

    html = build_html(
        lesson.topic,
        lesson.grammar.description,
        new_words_html,
        old_phrases_html
    )

    generate_pdf(html, str(pdf_path))

    lesson.pdf_key = (
        f"lessons/{lesson.id}/lesson.pdf"
    )

    db.commit()
    db.refresh(lesson)

    return str(pdf_path)
