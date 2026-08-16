from pydantic import BaseModel
from datetime import date
from typing import Optional

class PriceResponse(BaseModel):
    commodity: str
    market: str
    date: date
    price: float
    moving_average_7d: Optional[float] = None
    percent_change_7d: Optional[float] = None

    class Config:
        from_attributes = True

class PriceSummary(BaseModel):
    current_price: float
    percent_change_7d: float
    best_nearby_market: str
