from enum import Enum


class Plan(str, Enum):
    FREE = "free"
    PRO = "pro"

class Status(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    INCOMPLETE = "incomplete"
    PAUSED = "paused"