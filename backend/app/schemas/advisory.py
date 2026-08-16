from pydantic import BaseModel
from typing import Optional

class AdvisoryResponse(BaseModel):
    recommendation: str
    confidence: str # "low", "medium", "high"

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

class ChatResponse(BaseModel):
    reply: str
    intent: Optional[str] = None
