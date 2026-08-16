from pydantic import BaseModel
from datetime import date

class WeatherResponse(BaseModel):
    district: str
    date: date
    temp: float
    rain: float

    class Config:
        from_attributes = True

class WeatherSummary(BaseModel):
    district: str
    current_temp: float
    current_rain: float
