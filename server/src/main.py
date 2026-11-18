from fastapi import FastAPI
from fastapi_pagination import add_pagination
from src.auth.router import router as auth_router
from src.lessons.router import router as lessons_router
from src.generation.router import router as generation_router
from src.users.router import router as users_router
from src.playlists.router import router as playlists_router
from src.payments.router import router as payments_router
from src.folders.router import router as folders_router
from fastapi.staticfiles import StaticFiles
from src.storage import UPLOAD_DIR
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from src.config import settings

app = FastAPI(
    title="MLUV API",
    version="0.4.2"
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {
        "name": "MLUV API",
        "status": "running",
    }
app.include_router(folders_router)
app.include_router(playlists_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(generation_router)
app.include_router(lessons_router)
app.include_router(payments_router)

add_pagination(app)

app.mount(
    "/media",
    StaticFiles(directory=UPLOAD_DIR),
    name="media",
)