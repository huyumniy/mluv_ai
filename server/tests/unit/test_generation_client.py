from unittest.mock import Mock

import httpx
import pytest

from src.generation import client
from src.generation.client import (
    GroqAPIError,
    GroqRateLimitError,
)


def test_groq_request_success(
    monkeypatch,
):
    response_mock = Mock()
    response_mock.status_code = 200
    response_mock.json.return_value = {
        "choices": [
            {
                "message": {
                    "content": "test"
                }
            }
        ]
    }

    post_mock = Mock(
        return_value=response_mock
    )
    budget_mock = Mock()

    monkeypatch.setattr(
        client.httpx,
        "post",
        post_mock,
    )
    monkeypatch.setattr(
        client,
        "check_groq_budget",
        budget_mock,
    )

    result = client.groq_chat_request(
        messages=[
            {
                "role": "user",
                "content": "test",
            }
        ]
    )

    assert result == response_mock.json.return_value

    post_mock.assert_called_once()
    budget_mock.assert_called_once()


def test_groq_falls_back_after_429(
    monkeypatch,
):
    monkeypatch.setattr(
        client,
        "GROQ_MODELS",
        [
            "model-1",
            "model-2",
        ],
    )

    rate_limited_response = Mock()
    rate_limited_response.status_code = 429

    success_response = Mock()
    success_response.status_code = 200
    success_response.json.return_value = {
        "choices": []
    }

    post_mock = Mock(
        side_effect=[
            rate_limited_response,
            success_response,
        ]
    )

    budget_mock = Mock()

    monkeypatch.setattr(
        client.httpx,
        "post",
        post_mock,
    )
    monkeypatch.setattr(
        client,
        "check_groq_budget",
        budget_mock,
    )

    result = client.groq_chat_request(
        messages=[]
    )

    assert result == {
        "choices": []
    }

    assert post_mock.call_count == 2
    assert budget_mock.call_count == 2

    first_payload = (
        post_mock
        .call_args_list[0]
        .kwargs["json"]
    )

    second_payload = (
        post_mock
        .call_args_list[1]
        .kwargs["json"]
    )

    assert (
        first_payload["model"]
        == "model-1"
    )

    assert (
        second_payload["model"]
        == "model-2"
    )


def test_all_groq_models_rate_limited(
    monkeypatch,
):
    monkeypatch.setattr(
        client,
        "GROQ_MODELS",
        [
            "model-1",
            "model-2",
        ],
    )

    response_mock = Mock()
    response_mock.status_code = 429

    post_mock = Mock(
        return_value=response_mock
    )

    monkeypatch.setattr(
        client.httpx,
        "post",
        post_mock,
    )
    monkeypatch.setattr(
        client,
        "check_groq_budget",
        Mock(),
    )

    with pytest.raises(
        GroqRateLimitError
    ):
        client.groq_chat_request(
            messages=[]
        )

    assert post_mock.call_count == 2


def test_groq_api_error(
    monkeypatch,
):
    response_mock = Mock()
    response_mock.status_code = 400
    response_mock.text = (
        "Bad request"
    )

    post_mock = Mock(
        return_value=response_mock
    )

    monkeypatch.setattr(
        client.httpx,
        "post",
        post_mock,
    )
    monkeypatch.setattr(
        client,
        "check_groq_budget",
        Mock(),
    )

    with pytest.raises(
        GroqAPIError
    ) as exc:
        client.groq_chat_request(
            messages=[]
        )

    assert "400" in str(exc.value)
    assert "Bad request" in str(
        exc.value
    )


def test_groq_connection_error(
    monkeypatch,
):
    request = httpx.Request(
        "POST",
        "https://api.groq.com",
    )

    post_mock = Mock(
        side_effect=httpx.RequestError(
            "Connection failed",
            request=request,
        )
    )

    monkeypatch.setattr(
        client.httpx,
        "post",
        post_mock,
    )
    monkeypatch.setattr(
        client,
        "check_groq_budget",
        Mock(),
    )

    with pytest.raises(
        GroqAPIError
    ) as exc:
        client.groq_chat_request(
            messages=[]
        )

    assert (
        str(exc.value)
        == "Could not connect to Groq"
    )