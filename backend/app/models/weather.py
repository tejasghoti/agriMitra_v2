from sqlalchemy import Column, Integer, String, Float, Date, Index
from app.core.database import Base

class WeatherLog(Base):
    __tablename__ = "weather_logs"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String, index=True)
    date = Column(Date, index=True)
    temp = Column(Float)
    rain = Column(Float)

    __table_args__ = (
        Index('idx_district_date', 'district', 'date'),
    )
