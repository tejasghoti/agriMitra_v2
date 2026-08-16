import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriMitra"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agrimitra.db")
    AGMARKNET_API_KEY: str = os.getenv("AGMARKNET_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    CORS_ORIGIN: str = os.getenv("CORS_ORIGIN", "http://localhost:5173")

    class Config:
        env_file = ".env"

settings = Settings()
