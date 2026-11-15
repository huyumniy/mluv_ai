import stripe
from stripe import StripeClient

from src.config import settings
print(settings.stripe_secret_key, "secret")

stripe_client = StripeClient(
    settings.stripe_secret_key,
    http_client=stripe.HTTPXClient(
        allow_sync_methods=True,
    ),
    max_network_retries=2,
)
