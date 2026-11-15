from typing import Annotated
from fastapi_pagination import Page, paginate
import stripe
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    File,
    UploadFile,
    Path,
    Query,
    APIRouter,
    Header,
    Request,
)
from src.config import settings
from src.payments.schemas import CheckoutRequest, CheckoutResponse
from src.payments import service as payments_service
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.dependencies import CurrentUser

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)

DbSession = Annotated[
    Session,
    Depends(get_db),
]

@router.get("/me")
def get_me(
    db: DbSession,
    current_user: CurrentUser,
):
    subscription = (
        payments_service
        .get_current_user_subscription(
            db=db,
            user_id=current_user.id,
        )
    )

    if not subscription:
        return {
            "subscription": None,
        }

    return {
        "subscription": subscription
    }


@router.post(
    "/checkout",
    response_model=CheckoutResponse,
)
def create_checkout(
    data: CheckoutRequest,
    db: DbSession,
    current_user: CurrentUser,
):
    try:
        url = payments_service.create_checkout_session(
            db=db,
            current_user=current_user,
            plan=data.plan,
        )

        return CheckoutResponse(
            url=url,
        )

    except Exception as e:
        print("create_checkout router exception ", e)
        raise HTTPException(
            status_code=400,
            detail="Invalid plan",
        )


@router.post("/cancel")
async def stripe_cancel_subscription(
    db: DbSession,
    current_user: CurrentUser,
):
    subscription = (
        payments_service
        .get_current_user_subscription(
            db=db,
            user_id=current_user.id,
        )
    )

    if not subscription:
        return {
            "subscription": None,
        }

    result = payments_service.cancel_subscription(
        subscription=subscription,
    )

    return result


@router.post("/resume")
async def stripe_resume_subscription(
    db: DbSession,
    current_user: CurrentUser,
):
    subscription = (
        payments_service
        .get_current_user_subscription(
            db=db,
            user_id=current_user.id,
        )
    )

    if not subscription:
        return {
            "subscription": None,
        }

    result = payments_service.resume_subscription(
        subscription=subscription,
    )

    return result


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: DbSession,
    stripe_signature: str | None = Header(
        default=None,
        alias="Stripe-Signature",
    ),
):
    payload = await request.body()

    if not stripe_signature:
        raise HTTPException(
            status_code=400,
            detail="Missing Stripe signature",
        )

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=settings.stripe_webhook_secret,
        )

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid webhook payload",
        )

    except stripe.SignatureVerificationError:
        raise HTTPException(
            status_code=400,
            detail="Invalid webhook signature",
        )

    event_type = event["type"]

    if event_type in {
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
    }:
        stripe_subscription = (
            event["data"]["object"]
        )

        payments_service.sync_stripe_subscription(
            db=db,
            stripe_subscription=stripe_subscription,
        )

    elif event_type == "invoice.payment_failed":
        # Later:
        # send email / notification to the user
        print("Stripe invoice payment failed")

    return {
        "received": True,
    }


@router.post("/portal")
def get_billing_portal_session(
    db: DbSession,
    current_user: CurrentUser,
):
    if not current_user.stripe_customer_id:
        raise HTTPException(
            status_code=400,
            detail="No billing account",
        )

    try:
        return payments_service.create_billing_portal_session(customer_id=current_user.stripe_customer_id)
    except stripe.error.StripeError as e:
        print(f"Erro billing portal session: {str(e)}")
        raise HTTPException(status_code=400, detail="Error creating billing portal session") from None
