from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import json
import os

from app.core.database import get_db
from app.models.weather import WeatherLog
from app.schemas.weather import WeatherResponse, WeatherSummary

router = APIRouter()

def get_fallback_weather():
    fallback_path = os.path.join(os.path.dirname(__file__), "../../../seed_data/weather.json")
    try:
        with open(fallback_path, "r") as f:
            return json.load(f)
    except Exception:
        return []

@router.get("/history", response_model=List[WeatherResponse])
def get_weather_history(
    district: str = "Pune", 
    days: int = 14, 
    db: Session = Depends(get_db)
):
    try:
        cutoff = datetime.now().date() - timedelta(days=days)
        results = db.query(WeatherLog).filter(
            WeatherLog.district == district,
            WeatherLog.date >= cutoff
        ).order_by(WeatherLog.date.asc()).all()
        
        if not results:
            fallback = get_fallback_weather()
            return [w for w in fallback if w.get("district") == district]
            
        return results
    except Exception as e:
        fallback = get_fallback_weather()
        return [w for w in fallback if w.get("district") == district]

@router.get("/summary", response_model=WeatherSummary)
def get_weather_summary(
    district: str = "Pune", 
    db: Session = Depends(get_db)
):
    try:
        latest = db.query(WeatherLog).filter(
            WeatherLog.district == district
        ).order_by(WeatherLog.date.desc()).first()
        
        if not latest:
            fallback = [w for w in get_fallback_weather() if w.get("district") == district]
            if fallback:
                latest_fb = fallback[-1]
                return WeatherSummary(
                    district=district,
                    current_temp=latest_fb["temp"],
                    current_rain=latest_fb["rain"]
                )
            raise HTTPException(status_code=404, detail="Data not found")
            
        return WeatherSummary(
            district=district,
            current_temp=latest.temp,
            current_rain=latest.rain
        )
    except Exception as e:
        fallback = [w for w in get_fallback_weather() if w.get("district") == district]
        if fallback:
            latest_fb = fallback[-1]
            return WeatherSummary(
                district=district,
                current_temp=latest_fb["temp"],
                current_rain=latest_fb["rain"]
            )
        raise HTTPException(status_code=500, detail="Database unavailable")
