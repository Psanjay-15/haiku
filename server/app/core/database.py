from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(settings.database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)


def get_db_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def check_database_connection() -> None:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


def enable_row_level_security() -> None:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE intakes ENABLE ROW LEVEL SECURITY"))
        connection.execute(
            text("ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY")
        )
