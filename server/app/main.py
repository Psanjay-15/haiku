from fastapi import FastAPI, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import check_database_connection

app = FastAPI(
    title="Haiku",
    version="0.1.0",
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
