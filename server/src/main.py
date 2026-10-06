from fastapi import FastAPI

from src.auth.router import router as auth_router
from src.lessons.router import router as lessons_router
from src.generation.router import router as generation_router
from src.users.router import router as users_router
app = FastAPI(
    title="MLUV API",
    version="0.1.0,"
)

@app.get('/')
def root():
    return {
        "name": "MLUV API",
        "status": "running",
    }

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(generation_router)
app.include_router(lessons_router)