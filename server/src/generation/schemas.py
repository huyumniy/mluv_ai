from pydantic import BaseModel, Field, ConfigDict
from src.generation.enums import GenerationType
from src.lessons.schemas import LessonPhraseResponse, LessonResponse


class LessonGenerationRequest(BaseModel):
    type: GenerationType = Field(
        default=GenerationType.NEW,
        description='Possible generation types: "new" or "repeat"'
    )
    phrase_count: int = Field(
        default=5,
        ge=1,
        le=15,
    )

class LessonGenerationResponse(BaseModel):
    lesson: LessonResponse
    phrases: list[LessonPhraseResponse] | None = None

    new_phrases: list[LessonPhraseResponse] | None = None
    audio_url: str | None = None
    pdf_url: str | None = None


class GenerationTaskResponse(BaseModel):
    job_id: int
    lesson_id: int
    task_id: str
    status: str

class GroqGeneratedPhrase(BaseModel):
    model_config = ConfigDict(
        extra="forbid"
    )

    ua: str
    cz: str


class GroqPhraseBatch(BaseModel):
    model_config = ConfigDict(
        extra="forbid"
    )

    phrases: list[
        GroqGeneratedPhrase
    ]
class GeneratedPhrase(BaseModel):
    translation: str
    original: str
    original_slowed: str


class GenerationError(Exception):
    pass


class MissingGrammarError(
    GenerationError
):
    pass


class PhraseGenerationError(
    GenerationError
):
    pass