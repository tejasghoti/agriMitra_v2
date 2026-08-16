from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import json
import os

from app.core.database import get_db
from app.models.prices import MandiPrice
from app.schemas.prices import PriceResponse, PriceSummary

router = APIRouter()

def get_fallback_prices():
    fallback_path = os.path.join(os.path.dirname(__file__), "../../../seed_data/prices.json")
    try:
        with open(fallback_path, "r") as f:
            return json.load(f)
    except Exception:
        return []

@router.get("/history", response_model=List[PriceResponse])
def get_price_history(
    commodity: str = "Tomato", 
    market: str = "Pune", 
    days: int = 60, 
    db: Session = Depends(get_db)
):
    try:
        cutoff = datetime.now().date() - timedelta(days=days)
        results = db.query(MandiPrice).filter(
            MandiPrice.commodity == commodity,
            MandiPrice.market == market,
            MandiPrice.date >= cutoff
        ).order_by(MandiPrice.date.asc()).all()
        
        if not results:
            # Graceful degradation to seed data
            fallback = get_fallback_prices()
            return [p for p in fallback if p.get("commodity") == commodity and p.get("market") == market]
            
        return results
    except Exception as e:
        fallback = get_fallback_prices()
        return [p for p in fallback if p.get("commodity") == commodity and p.get("market") == market]

@router.get("/summary", response_model=PriceSummary)
def get_price_summary(
    commodity: str = "Tomato", 
    market: str = "Pune", 
    db: Session = Depends(get_db)
):
    try:
        latest = db.query(MandiPrice).filter(
            MandiPrice.commodity == commodity,
            MandiPrice.market == market
        ).order_by(MandiPrice.date.desc()).first()
        
        if not latest:
            fallback = [p for p in get_fallback_prices() if p.get("commodity") == commodity and p.get("market") == market]
            if fallback:
                latest_fb = fallback[-1]
                return PriceSummary(
                    current_price=latest_fb["price"],
                    percent_change_7d=latest_fb.get("percent_change_7d", 0.0),
                    best_nearby_market=market
                )
            raise HTTPException(status_code=404, detail="Data not found")
            
        return PriceSummary(
            current_price=latest.price,
            percent_change_7d=latest.percent_change_7d or 0.0,
            best_nearby_market=market # Simplified for demo
        )
    except Exception as e:
        fallback = [p for p in get_fallback_prices() if p.get("commodity") == commodity and p.get("market") == market]
        if fallback:
            latest_fb = fallback[-1]
            return PriceSummary(
                current_price=latest_fb["price"],
                percent_change_7d=latest_fb.get("percent_change_7d", 0.0),
                best_nearby_market=market
            )
        raise HTTPException(status_code=500, detail="Database unavailable")

@router.get("/forecast", response_model=List[PriceResponse])
def get_price_forecast(
    commodity: str = "Tomato", 
    market: str = "Pune", 
    horizon: int = 7, 
    db: Session = Depends(get_db)
):
    # In a real system, the cron job precomputes this and saves to DB. 
    # For demo, we fetch last real prices and apply naive drift if DB has it, else fallback.
    history = get_price_history(commodity, market, 14, db)
    if not history:
        return []
    
    # Naive drift forecast
    last_price = history[-1].price if hasattr(history[-1], 'price') else history[-1]['price']
    last_date = history[-1].date if hasattr(history[-1], 'date') else datetime.strptime(history[-1]['date'], "%Y-%m-%d").date()
    
    forecasts = []
    for i in range(1, horizon + 1):
        # Fake slight upward drift for demo purposes
        last_price += 0.5 
        forecasts.append(PriceResponse(
            commodity=commodity,
            market=market,
            date=last_date + timedelta(days=i),
            price=round(last_price, 2)
        ))
    return forecasts
