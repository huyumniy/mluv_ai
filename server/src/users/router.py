from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get("/status")
def users_status():
    return {
        "status": "ok"
    }