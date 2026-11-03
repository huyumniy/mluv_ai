import httpx
from src.generation.settings import GROQ_API_KEY, GROQ_URL, GROQ_MODELS
from src.generation.schemas import GroqPhraseBatch
from src.generation.limits import (
    check_groq_budget,
)


class GroqAPIError(Exception):
    pass


class GroqRateLimitError(GroqAPIError):
    pass



def groq_chat_request(messages: list) -> dict:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    rate_limit_errors = []
    for model in GROQ_MODELS:
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "reasoning_effort": "low",

            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "lesson_phrases",
                    "strict": True,
                    "schema": (
                        GroqPhraseBatch.
                        model_json_schema()
                    ),
                },
            },
        }
        
        check_groq_budget()

        try:
            response = httpx.post(
                GROQ_URL,
                json=payload,
                headers=headers,
                timeout=60.0,
            )

        except httpx.RequestError as exc:
            raise GroqAPIError(
                "Could not connect to Groq"
            ) from exc

        if response.status_code == 200:
            return response.json()

        if response.status_code == 429:
            rate_limit_errors.append(
                f"{model}: {response.text}"
            )

            continue

        raise GroqAPIError(
            f"Groq API error "
            f"{response.status_code}: "
            f"{response.text}"
        )

    raise GroqRateLimitError(
        "All Groq models are currently rate limited"
    )
