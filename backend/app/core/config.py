from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "YOUR_RANDOM_SECRET"
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    JWT_LIFETIME_SECONDS: int = 3600

    class Config:
        env_file = ".env"

settings = Settings()