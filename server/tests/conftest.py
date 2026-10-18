import os
from collections.abc import AsyncGenerator
from pathlib import Path

import pytest

from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.database import Base, get_db
from src.main import app
from dotenv import load_dotenv 

import src.folders.models
import src.lessons.models
import src.playlists.models
import src.users.models

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

load_dotenv()
TEST_DATABASE_URL = os.environ["TEST_DATABASE_URL"]

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    engine = create_engine(
        TEST_DATABASE_URL,
    )

    Base.metadata.drop_all(
        bind=engine,
    )

    Base.metadata.create_all(
        bind=engine,
    )

    TestSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        expire_on_commit=False,
    )

    def override_get_db():
        db = TestSessionLocal()

        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[
        get_db
    ] = override_get_db

    transport = ASGITransport(
        app=app,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as test_client:
        yield test_client

    app.dependency_overrides.clear()

    Base.metadata.drop_all(
        bind=engine,
    )

    engine.dispose()