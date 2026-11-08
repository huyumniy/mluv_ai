import pytest
from types import SimpleNamespace
from unittest.mock import Mock

from src.generation.helpers import make_slow_phrase, normalize_phrase
from src.generation import service
from src.generation.enums import GenerationType, GenerationStatus
from src.generation.schemas import (
    GroqPhraseBatch,
    GroqGeneratedPhrase,
    PhraseGenerationError,
    MissingGrammarError,
    LessonGenerationRequest
)
from src.worker import tasks as worker_tasks

def test_make_slow_phrase():
    result1 = make_slow_phrase(phrase="ty nechceš jít")
    result2 = make_slow_phrase(phrase="můžeš")
    result3 = make_slow_phrase(phrase="")

    assert result1 == "ty... nechceš... jít"
    assert result2 == "můžeš"
    assert result3 == ""


def test_normalize_phrase():
    result1 = normalize_phrase(phrase="tY neCHceš Jít")
    result2 = normalize_phrase(phrase="MůžEš")
    result3 = normalize_phrase(phrase="")

    assert result1 == "ty nechceš jít"
    assert result2 == "můžeš"
    assert result3 == ""


def test_generate_text(monkeypatch):
    fake_response = {
        "choices": [
            {
                "message": {
                    "content": """
                    {
                        "phrases": [
                            {
                                "ua": "Я працюю",
                                "cz": "Já pracuji"
                            }
                        ]
                    }
                    """
                }
            }
        ]
    }

    monkeypatch.setattr(
        service,
        "groq_chat_request",
        lambda messages: fake_response,
    )

    result = service.generate_text(
        prompt="Generate one sentence",
        system="You are Czech teacher",
    )

    assert len(result.phrases) == 1
    assert result.phrases[0].ua == "Я працюю"
    assert result.phrases[0].cz == "Já pracuji"


def test_generate_text_invalid_response(
    monkeypatch,
):
    fake_response = {
        "choices": []
    }

    monkeypatch.setattr(
        service,
        "groq_chat_request",
        lambda messages: fake_response,
    )

    with pytest.raises(
        PhraseGenerationError
    ):
        service.generate_text(
            prompt="test"
        )


def test_generate_text_invalid_json(
    monkeypatch,
):
    fake_response = {
        "choices": [
            {
                "message": {
                    "content": "not json"
                }
            }
        ]
    }

    monkeypatch.setattr(
        service,
        "groq_chat_request",
        lambda messages: fake_response,
    )

    with pytest.raises(
        PhraseGenerationError
    ):
        service.generate_text(
            prompt="test"
        )


def test_generate_phrase_batch(monkeypatch):
    lesson = SimpleNamespace(
        level="A1",
        grammar=SimpleNamespace(
            description="Modal verbs"
        ),
        phrases=[],
    )

    def fake_generate_text(
        *args,
        **kwargs,
    ):
        return GroqPhraseBatch(
            phrases=[
                GroqGeneratedPhrase(
                    ua="Я мушу працювати",
                    cz="Já musím pracovat",
                )
            ]
        )

    monkeypatch.setattr(
        service,
        "generate_text",
        fake_generate_text,
    )
    result = service.generate_phrase_batch(
        lesson=lesson,
        count=1,
        level=lesson.level,
    )

    assert len(result) == 1
    assert (
        result[0].original
        == "Já musím pracovat"
    )


def test_missing_grammar(monkeypatch):
    lesson = SimpleNamespace(
        level="A1",
        grammar=None,
        phrases=[],
    )
    with pytest.raises(
        MissingGrammarError
    ):
        service.generate_phrase_batch(
            lesson=lesson,
            count=5,
            level="A1",
        )


def test_fill_lesson_phrases_commits_each_batch(monkeypatch):
    db = Mock()

    lesson = SimpleNamespace(
        level="A1",
        grammar=SimpleNamespace(
            description="Modal verbs"
        ),
        phrases=[],
    )

    def fake_generate_phrase_batch(
        lesson,
        count,
        level,
    ):
        return [
            SimpleNamespace(
                translation=f"ua {i}",
                original=f"cz {i}",
                original_slowed=f"cz_slow {i}",
            )
            for i in range(count)
        ]

    monkeypatch.setattr(
        service,
        "generate_phrase_batch",
        fake_generate_phrase_batch,
    )

    service.fill_lesson_phrases(db, lesson, target_count=25)

    assert len(lesson.phrases) == 25

    assert db.commit.call_count == 3


def test_new_generation_returns_new_and_mixed_phrases(
    monkeypatch,
):
    db = Mock()

    old_phrases = [
        SimpleNamespace(
            id=i,
            original=f"old {i}",
        )
        for i in range(50)
    ]

    lesson = SimpleNamespace(
        level="A1",
        phrases=old_phrases.copy(),
    )

    data = SimpleNamespace(
        type=GenerationType.NEW,
        phrase_count=5,
    )

    generated = [
        SimpleNamespace(
            translation=f"ua {i}",
            original=f"new {i}",
            original_slowed=f"new {i}",
        )
        for i in range(5)
    ]

    new_phrases = [
        SimpleNamespace(
            id=100 + i,
            original=f"new {i}",
        )
        for i in range(5)
    ]

    monkeypatch.setattr(
        service,
        "generate_phrase_batch",
        lambda **kwargs: generated,
    )

    def fake_append(
        lesson,
        generated,
    ):
        lesson.phrases.extend(
            new_phrases
        )

        return new_phrases

    monkeypatch.setattr(
        service,
        "append_phrases",
        fake_append,
    )

    new_result, all_result = (
        service
        .generate_phrases_for_lesson(
            db=db,
            data=data,
            lesson=lesson,
        )
    )

    assert len(new_result) == 5
    assert len(all_result) == 50

    for phrase in new_result:
        assert phrase in all_result


def test_generation_fills_lesson_before_use(
    monkeypatch,
):
    db = Mock()

    lesson = SimpleNamespace(
        level="A1",
        phrases=[
            SimpleNamespace(id=i)
            for i in range(20)
        ],
    )

    data = SimpleNamespace(
        type=GenerationType.REPEAT,
        phrase_count=5,
    )

    def fake_fill(
        db,
        lesson,
        target_count,
    ):
        lesson.phrases = [
            SimpleNamespace(id=i)
            for i in range(50)
        ]

        return lesson

    fill_mock = Mock(
        side_effect=fake_fill
    )

    monkeypatch.setattr(
        service,
        "fill_lesson_phrases",
        fill_mock,
    )

    _, phrases = (
        service
        .generate_phrases_for_lesson(
            db=db,
            data=data,
            lesson=lesson,
        )
    )

    fill_mock.assert_called_once()

    assert len(phrases) == 50


def test_repeat_mode_returns_existing_phrases(monkeypatch):
    db = Mock()
    data = LessonGenerationRequest(type=GenerationType.REPEAT)

    generate_mock = Mock()

    monkeypatch.setattr(
        service,
        "generate_phrase_batch",
        generate_mock,
    )

    lesson = SimpleNamespace(
        level="A1",
        grammar=SimpleNamespace(
            description="Modal verbs"
        ),
        phrases=[SimpleNamespace(
            position=i,
            translation=f"ua {i}",
            original=f"cz {i}",
            original_slowed=f"cz_slow {i}",
        )
        for i in range(50)],
    )

    new_phrases, phrases = service.generate_phrases_for_lesson(db, data, lesson)

    assert new_phrases == []
    assert len(phrases) == 50

    generate_mock.assert_not_called()
    db.commit.assert_not_called()


def test_generate_lesson_task_success(
    monkeypatch,
):
    db = Mock()

    job = SimpleNamespace(
        id=1,
        user_id=10,
        lesson_id=20,
        status=GenerationStatus.QUEUED.value,
        error=None,
    )

    lesson = SimpleNamespace(
        id=20,
    )

    monkeypatch.setattr(
        worker_tasks,
        "SessionLocal",
        lambda: db,
    )

    monkeypatch.setattr(
        worker_tasks.generation_service,
        "get_by_id",
        lambda **kwargs: job,
    )

    monkeypatch.setattr(
        worker_tasks.lesson_service,
        "get_by_id",
        lambda **kwargs: lesson,
    )

    def fake_generate_lesson(
        db,
        data,
        lesson,
        on_stage,
    ):
        on_stage(
            GenerationStatus.GENERATING_PHRASES
        )

        on_stage(
            GenerationStatus.GENERATING_AUDIO
        )

        on_stage(
            GenerationStatus.GENERATING_PDF
        )

    monkeypatch.setattr(
        worker_tasks.generation_service,
        "generate_lesson",
        fake_generate_lesson,
    )

    result = (
        worker_tasks
        .generate_lesson_task
        .run(
            job_id=job.id,
            user_id=job.user_id,
            generation_type=(
                GenerationType.REPEAT.value
            ),
            phrase_count=5,
        )
    )

    assert result == {
        "job_id": job.id,
        "lesson_id": lesson.id,
    }

    assert (
        job.status
        == GenerationStatus.SUCCESS.value
    )

    assert job.error is None

    db.close.assert_called_once()


def test_generate_lesson_task_failure(
    monkeypatch,
):
    db = Mock()

    job = SimpleNamespace(
        id=1,
        user_id=10,
        lesson_id=20,
        status=GenerationStatus.QUEUED.value,
        error=None,
    )

    lesson = SimpleNamespace(
        id=20,
    )

    monkeypatch.setattr(
        worker_tasks,
        "SessionLocal",
        lambda: db,
    )

    monkeypatch.setattr(
        worker_tasks.generation_service,
        "get_by_id",
        lambda **kwargs: job,
    )

    monkeypatch.setattr(
        worker_tasks.lesson_service,
        "get_by_id",
        lambda **kwargs: lesson,
    )

    def fake_generate_lesson(**kwargs):
        raise ValueError(
            "Generation failed"
        )

    monkeypatch.setattr(
        worker_tasks.generation_service,
        "generate_lesson",
        fake_generate_lesson,
    )

    db.get.return_value = job

    with pytest.raises(
        ValueError,
        match="Generation failed",
    ):
        (
            worker_tasks
            .generate_lesson_task
            .run(
                job_id=job.id,
                user_id=job.user_id,
                generation_type=(
                    GenerationType.REPEAT.value
                ),
                phrase_count=5,
            )
        )

    assert (
        job.status
        == GenerationStatus.FAILED.value
    )

    assert (
        job.error
        == "Generation failed"
    )

    db.rollback.assert_called_once()
    db.close.assert_called_once()


def test_generate_lesson_task_retries(
    monkeypatch,
):
    db = Mock()

    job = SimpleNamespace(
        id=1,
        user_id=10,
        lesson_id=20,
        status=GenerationStatus.QUEUED.value,
        error=None,
    )

    lesson = SimpleNamespace(
        id=20,
    )

    monkeypatch.setattr(
        worker_tasks,
        "SessionLocal",
        lambda: db,
    )

    monkeypatch.setattr(
        worker_tasks.generation_service,
        "get_by_id",
        lambda **kwargs: job,
    )

    monkeypatch.setattr(
        worker_tasks.lesson_service,
        "get_by_id",
        lambda **kwargs: lesson,
    )

    def fake_generate_lesson(**kwargs):
        raise PhraseGenerationError(
            "Temporary generation error"
        )

    monkeypatch.setattr(
        worker_tasks.generation_service,
        "generate_lesson",
        fake_generate_lesson,
    )

    retry_mock = Mock(
        side_effect=RuntimeError(
            "retry called"
        )
    )

    monkeypatch.setattr(
        worker_tasks.generate_lesson_task,
        "retry",
        retry_mock,
    )

    with pytest.raises(
        RuntimeError,
        match="retry called",
    ):
        (
            worker_tasks
            .generate_lesson_task
            .run(
                job_id=job.id,
                user_id=job.user_id,
                generation_type=(
                    GenerationType.REPEAT.value
                ),
                phrase_count=5,
            )
        )

    retry_mock.assert_called_once()

    db.rollback.assert_called_once()
    db.close.assert_called_once()