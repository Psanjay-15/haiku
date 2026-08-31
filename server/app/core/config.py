import os
from dotenv import load_dotenv

load_dotenv()

def require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"{name} is not set in the .env file")
    return value


class Settings:
    def __init__(self) -> None:
        self.port: int = int(os.getenv("PORT", "8000"))
        self.database_url: str = require("DATABASE_URL")


settings = Settings()
