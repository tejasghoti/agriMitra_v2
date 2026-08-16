from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from datetime import datetime

router = APIRouter()

# Mocking the last refresh time for demo purposes. 
# In a real app, this might be queried from a 'cron_logs' table or Redis.
LAST_REFRESH_TIME = datetime.utcnow().isoformat()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "ok"
    try:
        # Check DB connectivity
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "unavailable"
        
    status = "ok" if db_status == "ok" else "degraded"
    
    return {
        "status": status,
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/meta/last-refresh")
def get_last_refresh():
    return {
        "last_refresh": LAST_REFRESH_TIME
    }
