from fastapi import APIRouter

router = APIRouter(
    prefix="/generation",
    tags=["Generation"],
)

@router.get("/status")
def generation_status():
    return {
        "status": "ok"
    }