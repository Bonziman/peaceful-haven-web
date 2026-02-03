"""Trade-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional, List

class TradeRecord(BaseModel):
    timestamp: str
    player_uuid: str
    player_name: str
    shop_uuid: str
    shop_owner_uuid: Optional[str]
    shop_owner_name: Optional[str]
    item_1_type: str
    item_1_amount: int
    item_2_type: Optional[str] = None
    item_2_amount: Optional[int] = None
    result_item_type: str
    result_item_amount: int
    trade_count: int
    
    class Config:
        from_attributes = True

class TradeStats(BaseModel):
    """Trade statistics for a player"""
    total_trades: int
    total_items_sold: int
    total_items_bought: int
    most_sold_item: Optional[str] = None
    most_sold_count: int = 0
    unique_customers: int = 0

class PlayerTradeHistory(BaseModel):
    """Trade history for a specific player"""
    player_uuid: str
    player_name: str
    trades: List[TradeRecord]
    total: int

class TopSeller(BaseModel):
    """Top seller information"""
    player_uuid: str
    player_name: str
    total_sales: int
    unique_items: int
