from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.v1 import prices, weather, advisory, chat, health

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AgriMitra Decision-Support API"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices.router, prefix=f"{settings.API_V1_STR}/prices", tags=["prices"])
app.include_router(weather.router, prefix=f"{settings.API_V1_STR}/weather", tags=["weather"])
app.include_router(advisory.router, prefix=f"{settings.API_V1_STR}/advisory", tags=["advisory"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}", tags=["health"])

# Root fallback redirect to docs
@app.get("/")
def root():
    return {"message": "Welcome to AgriMitra API. Visit /docs for the API documentation."}
