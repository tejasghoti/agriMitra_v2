from fastapi import APIRouter
from app.schemas.advisory import ChatRequest, ChatResponse
import re

router = APIRouter()

def simple_intent_parser(message: str) -> str:
    msg_lower = message.lower()
    if any(keyword in msg_lower for keyword in ["price", "bhav", "rate", "भाव"]):
        return "price"
    elif any(keyword in msg_lower for keyword in ["weather", "rain", "temp", "पाऊस", "हवामान"]):
        return "weather"
    elif any(keyword in msg_lower for keyword in ["should i sell", "advisory", "विकू का"]):
        return "advisory"
    return "unknown"

@router.post("/", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    intent = simple_intent_parser(req.message)
    
    if intent == "price":
        # In a real app, extract entities (crop, location) here
        reply = "Current price for Tomato in Pune is ₹25.5/kg. Prices are up 5.2% from last week."
    elif intent == "weather":
        reply = "Today's weather in Pune is 28.5°C with 2.1mm rainfall expected."
    elif intent == "advisory":
        reply = "Prices are 5.2% above the 7-day average and trending up — consider selling now to capture the premium."
    else:
        # Dummy fallback logic for LLM
        reply = "I am AgriMitra's AI assistant. I didn't quite catch that. You can ask me about Mandi prices, weather forecasts, or whether you should sell your crop today!"
        
    return ChatResponse(reply=reply, intent=intent)
