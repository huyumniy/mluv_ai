from sqlalchemy.orm import Session
from src.payments.models import Subscription
from sqlalchemy import select
from src.payments.stripe_client import stripe_client
from src.config import settings
from datetime import datetime, timezone
from src.users.models import User

PLANS = {
    "pro_monthly": settings.stripe_price_pro_monthly,
    "pro_yearly": settings.stripe_price_pro_yearly,
}


def get_user_plan(
    subscription: Subscription | None,
) -> bool:
    if subscription and subscription.status in {
        "active",
        "trialing",
    }:
        return "pro"

    return "free"


def get_current_user_subscription(
    db: Session, user_id: int
) -> Subscription | None:
    statement = (
        select(Subscription)
        .where(
            Subscription.user_id == user_id
        )
    )

    return db.scalar(statement)
    

def get_or_create_stripe_customer(
    db: Session,
    current_user: User,
) -> str:
    if current_user.stripe_customer_id:
        return current_user.stripe_customer_id

    customer = stripe_client.v1.customers.create(
        params={
            "email": current_user.email,
            "metadata": {
                "user_id": str(current_user.id),
            },
        }
    )

    current_user.stripe_customer_id = customer.id

    db.commit()
    db.refresh(current_user)

    return customer.id


def cancel_subscription(
    subscription: Subscription,
):
    result = stripe_client.v1.subscriptions.update(
        subscription.stripe_subscription_id,
        params={
            "cancel_at_period_end": True,
        },
    )

    return {
        "status": result.status,
        "cancel_at_period_end": result.cancel_at_period_end,
    }


def resume_subscription(
    subscription: Subscription,
):
    result = stripe_client.v1.subscriptions.update(
        subscription.stripe_subscription_id,
        params={
            "cancel_at_period_end": False,
        },
    )

    return {
        "status": result.status,
        "cancel_at_period_end": result.cancel_at_period_end,

    }


def create_checkout_session(
    db: Session,
    current_user: User,
    plan: str,
) -> str:
    price_id = PLANS.get(plan)
    print(price_id, "price_id")


    existing = get_current_user_subscription(
        db=db,
        user_id=current_user.id,
    )

    if existing and existing.status in {
        "active",
        "trialing",
        "past_due",
        "unpaid",
        "paused",
    }:
        raise ValueError("User already has subscription")

    if not price_id:
        raise ValueError("Invalid plan")

    customer_id = get_or_create_stripe_customer(
        db=db,
        current_user=current_user,
    )

    session = stripe_client.v1.checkout.sessions.create(
        params={
            "mode": "subscription",

            "customer": customer_id,

            "line_items": [
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],

            "success_url": (
                f"{settings.frontend_url}"
                "/payments/success"
                "?session_id={CHECKOUT_SESSION_ID}"
            ),

            "cancel_url": (
                f"{settings.frontend_url}"
                "/payments/cancel"
            ),

            "client_reference_id": str(current_user.id),

            "metadata": {
                "user_id": str(current_user.id),
                "plan": plan,
            },

            "subscription_data": {
                "metadata": {
                    "user_id": str(current_user.id),
                    "plan": plan,
                }
            },
        }
    )

    if not session.url:
        raise RuntimeError(
            "Stripe did not return checkout URL"
        )

    return session.url


def timestamp_to_datetime(
    value: int | None,
) -> datetime | None:
    if value is None:
        return None

    return datetime.fromtimestamp(
        value,
        tz=timezone.utc,
    )


def sync_stripe_subscription(
    db: Session,
    stripe_subscription,
) -> Subscription:
    data = stripe_subscription.to_dict()

    stripe_subscription_id = data["id"]
    stripe_customer_id = data["customer"]

    metadata = data.get("metadata", {})
    user_id = metadata.get("user_id")

    subscription = db.scalar(
        select(Subscription).where(
            Subscription.stripe_subscription_id
            == stripe_subscription_id
        )
    )

    if subscription is None:
        if not user_id:
            raise ValueError(
                "Stripe subscription has no user_id metadata"
            )

        user = db.get(User, int(user_id))

        if not user:
            raise ValueError(
                f"User {user_id} not found"
            )

        subscription = get_current_user_subscription(
            db=db,
            user_id=user.id,
        )

        if subscription is None:
            subscription = Subscription(
                user_id=user.id,
            )
            db.add(subscription)

        subscription.stripe_subscription_id = (
            stripe_subscription_id
        )

        if not user.stripe_customer_id:
            user.stripe_customer_id = (
                stripe_customer_id
            )

    item = data["items"]["data"][0]

    subscription.stripe_price_id = (
        item["price"]["id"]
    )

    subscription.status = data["status"]

    subscription.cancel_at_period_end = (
        data["cancel_at_period_end"]
    )

    subscription.current_period_start = (
        timestamp_to_datetime(
            item.get("current_period_start")
        )
    )

    subscription.current_period_end = (
        timestamp_to_datetime(
            item.get("current_period_end")
        )
    )

    db.commit()
    db.refresh(subscription)

    return subscription


def create_billing_portal_session(
    customer_id: str,
):
    session = stripe_client.v1.billing_portal.sessions.create({
        "customer": customer_id,
        "return_url": f"{settings.frontend_url}/settings/subscription",
    })

    return session.url
