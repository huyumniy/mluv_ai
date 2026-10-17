from enum import StrEnum
from typing import Annotated

from fastapi import Depends, Query

from src.lessons.enums import LessonLevel, LessonStatus


class LessonSortBy(StrEnum):
    ID = "id"
    TITLE = "title"
    DURATION = "duration"
    LEVEL = "level"
    STATUS = "status"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"


class SortOrder(StrEnum):
    ASC = "asc"
    DESC = "desc"


class LessonQueryParams:
    def __init__(
        self,
        search: str | None = Query(
            default=None,
            min_length=1,
            max_length=100,
        ),
        level: LessonLevel | None = Query(
            default=None,
        ),
        status: LessonStatus | None = Query(
            default=None,
        ),
        topic: str | None = Query(
            default=None,
            max_length=100,
        ),
        duration: int | None = Query(
            default=None,
        ),
        created_at: int | None = Query(
            default=None,
        ),
        updated_at: int | None = Query(
            default=None,
        ),
        sort_by: LessonSortBy = Query(
            default=LessonSortBy.ID,
        ),
        sort_order: SortOrder = Query(
            default=SortOrder.DESC,
        ),
    ):
        self.search = search
        self.level = level
        self.status = status
        self.topic = topic
        self.duration = duration
        self.created_at = created_at
        self.updated_at = updated_at

        self.sort_by = sort_by
        self.sort_order = sort_order


LessonQueryDep = Annotated[
    LessonQueryParams,
    Depends(),
]