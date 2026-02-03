"""Player-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional

class PlayerPlaytimeInfo(BaseModel):
    """Player playtime information"""
    uuid: str
    username: Optional[str] = None
    playtime_ticks: int
    playtime_hours: float
    playtime_formatted: str

class PlayerProfile(BaseModel):
    """Complete player profile"""
    uuid: str
    username: str
    playtime: Optional[PlayerPlaytimeInfo] = None
    total_shops: int = 0
    trade_stats: Optional[dict] = None
