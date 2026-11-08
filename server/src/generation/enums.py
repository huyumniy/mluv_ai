from enum import StrEnum

class GenerationType(StrEnum):
    REPEAT = "repeat"
    NEW = "new"


class GenerationStatus(StrEnum):
    QUEUED = "queued"
    SUCCESS = "success"
    FAILED = "failed"
    RETRYING = "retrying"
    GENERATING_PHRASES="generating_phrases"
    GENERATING_AUDIO="generating_audio"
    GENERATING_PDF="generating_pdf"

