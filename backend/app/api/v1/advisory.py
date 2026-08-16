from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.prices import MandiPrice
from app.schemas.advisory import AdvisoryResponse
from app.services.advisory_engine import generate_recommendation
from app.api.v1.prices import get_fallback_prices

router = APIRouter()

@router.get("/sell-or-hold", response_model=AdvisoryResponse)
def get_advisory(
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
            # Fallback
            fallback = [p for p in get_fallback_prices() if p.get("commodity") == commodity and p.get("market") == market]
            if fallback:
                latest_fb = fallback[-1]
                rec = generate_recommendation(latest_fb["price"], latest_fb.get("moving_average_7d", 0))
                return AdvisoryResponse(**rec)
            
            raise HTTPException(status_code=404, detail="Data not found for advisory")
            
        rec = generate_recommendation(latest.price, latest.moving_average_7d)
        return AdvisoryResponse(**rec)
    except Exception as e:
        # Graceful fallback
        fallback = [p for p in get_fallback_prices() if p.get("commodity") == commodity and p.get("market") == market]
        if fallback:
            latest_fb = fallback[-1]
            rec = generate_recommendation(latest_fb["price"], latest_fb.get("moving_average_7d", 0))
            return AdvisoryResponse(**rec)
        raise HTTPException(status_code=500, detail="Database unavailable")
