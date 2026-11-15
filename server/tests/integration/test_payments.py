from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

from src.payments import service


def test_get_existing_stripe_customer():
    db = MagicMock()

    user = SimpleNamespace(
        id=1,
        email="test@test.com",
        stripe_customer_id="cus_123",
    )

    result = service.get_or_create_stripe_customer(
        db=db,
        current_user=user,
    )

    assert result == "cus_123"
    db.commit.assert_not_called()


def test_create_checkout_session():
    db = MagicMock()

    user = SimpleNamespace(
        id=1,
        email="test@test.com",
        stripe_customer_id="cus_123",
    )

    with patch.object(
        service.stripe_client.v1.checkout.sessions,
        "create",
    ) as stripe_create:

        stripe_create.return_value = SimpleNamespace(
            url="https://checkout.stripe.com/test"
        )

        result = service.create_checkout_session(
            db=db,
            current_user=user,
            plan="pro_monthly",
        )

    assert result == "https://checkout.stripe.com/test"

    params = stripe_create.call_args.kwargs["params"]

    assert params["mode"] == "subscription"
    assert params["customer"] == "cus_123"

    assert (
        params["line_items"][0]["price"]
        == service.PLANS["pro_monthly"]
    )


def test_invalid_checkout_plan():
    db = MagicMock()

    user = SimpleNamespace(
        id=1,
        email="test@test.com",
        stripe_customer_id="cus_123",
    )

    with pytest.raises(ValueError):
        service.create_checkout_session(
            db=db,
            current_user=user,
            plan="random_plan",
        )


def test_cancel_subscription():
    subscription = SimpleNamespace(
        stripe_subscription_id="sub_123"
    )

    stripe_result = SimpleNamespace(
        status="active",
        cancel_at_period_end=True,
    )

    with patch.object(
        service.stripe_client.v1.subscriptions,
        "update",
        return_value=stripe_result,
    ) as stripe_update:

        result = service.cancel_subscription(
            subscription
        )

    stripe_update.assert_called_once_with(
        "sub_123",
        params={
            "cancel_at_period_end": True,
        },
    )

    assert result["status"] == "active"
    assert result["cancel_at_period_end"] is True


def test_resume_subscription():
    subscription = SimpleNamespace(
        stripe_subscription_id="sub_123"
    )

    stripe_result = SimpleNamespace(
        status="active",
        cancel_at_period_end=False,
    )

    with patch.object(
        service.stripe_client.v1.subscriptions,
        "update",
        return_value=stripe_result,
    ) as stripe_update:

        result = service.resume_subscription(
            subscription
        )

    stripe_update.assert_called_once_with(
        "sub_123",
        params={
            "cancel_at_period_end": False,
        },
    )

    assert result["status"] == "active"
    assert result["cancel_at_period_end"] is False


def test_sync_new_subscription():
    db = MagicMock()

    db.scalar.return_value = None

    user = SimpleNamespace(
        id=1,
        stripe_customer_id="cus_123",
    )

    db.get.return_value = user

    stripe_subscription = MagicMock()

    stripe_subscription.to_dict.return_value = {
        "id": "sub_123",
        "customer": "cus_123",
        "status": "active",
        "cancel_at_period_end": False,
        "metadata": {
            "user_id": "1",
        },
        "items": {
            "data": [
                {
                    "price": {
                        "id": "price_123",
                    },
                    "current_period_start": 1700000000,
                    "current_period_end": 1702592000,
                }
            ]
        },
    }

    result = service.sync_stripe_subscription(
        db=db,
        stripe_subscription=stripe_subscription,
    )

    assert result.user_id == 1
    assert result.stripe_subscription_id == "sub_123"
    assert result.stripe_price_id == "price_123"
    assert result.status == "active"
    assert result.cancel_at_period_end is False

    db.add.assert_called_once()
    db.commit.assert_called_once()
