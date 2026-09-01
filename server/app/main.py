from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.api.intake_form import router as intake_form_router
from app.api.intakes import router as intakes_router
from app.core.config import settings
from app.core.database import (
    Base,
    check_database_connection,
    enable_row_level_security,
    engine,
)
from app.core.seed import seed_intake_form
from app.models.intake import Intake
from app.models.intake_form import IntakeForm


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    enable_row_level_security()
    seed_intake_form()
    yield


app = FastAPI(
    title="Haiku",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(intake_form_router)
app.include_router(intakes_router)


@app.get("/")
def read_root():
    return {"name": "Haiku", "status": "running"}


@app.get("/health")
def health_check():
    try:
        check_database_connection()
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable",
        ) from exc

    return {"status": "healthy", "database": "connected"}
