from celery import Celery
from src import settings

app = Celery(
    "mluv_ai",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_BACKEND_URL,
    include=["src.worker.tasks"],
)

app.conf.update(
    result_expires=3600,

    control_queue_exclusive=True,
    event_queue_exclusive=True,
)

if __name__ == '__main__':
    app.start()