from sqlalchemy import Column, Integer, String, Float, Date, Index
from app.core.database import Base

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String, index=True)
    market = Column(String, index=True)
    date = Column(Date, index=True)
    price = Column(Float)
    moving_average_7d = Column(Float, nullable=True)
    percent_change_7d = Column(Float, nullable=True)

    __table_args__ = (
        Index('idx_commodity_market_date', 'commodity', 'market', 'date'),
    )
