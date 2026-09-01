from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import Base, check_database_connection, engine
from app.models.intake import Intake  


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Haiku",
    version="0.1.0",
    lifespan=lifespan,
)


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
