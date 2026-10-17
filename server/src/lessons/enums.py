from enum import StrEnum

class LessonLevel(StrEnum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"

class LessonStatus(StrEnum):
    CONTINUE = "continue"
    NOT_STARTED = "not-started"
    LISTENED = "listened"
    