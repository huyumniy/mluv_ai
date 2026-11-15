from pydantic import BaseModel, ConfigDict
from typing import Literal


class PlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: int
    currency: str
    interval: str


class CheckoutRequest(BaseModel):
    plan: Literal[
        "pro_monthly",
        "pro_yearly",
    ]


class CheckoutResponse(BaseModel):
    url: str
