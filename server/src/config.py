from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    app_name: str = "MLUV API"
    debug: bool = True

    database_url: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        extra="ignore",
    )
    stripe_secret_key: str
    stripe_webhook_secret: str
    stripe_price_pro_monthly: str
    stripe_price_pro_yearly: str
    frontend_url: str = "http://localhost:5173"

settings = Settings()