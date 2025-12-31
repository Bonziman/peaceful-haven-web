"""Shop-related Pydantic schemas"""
from pydantic import BaseModel
from typing import List, Optional

class ItemData(BaseModel):
    type: str
    amount: int
    display_name: Optional[str] = None
    lore: Optional[List[str]] = None
    custom_model_data: Optional[int] = None

class ShopOffer(BaseModel):
    id: str
    result: Optional[ItemData]
    cost1: Optional[ItemData]
    cost2: Optional[ItemData] = None

class ShopLocation(BaseModel):
    world: str
    x: int
    y: int
    z: int

class Shop(BaseModel):
    id: str
    uuid: str
    type: str
    name: Optional[str] = None
    owner_uuid: Optional[str] = None
    owner_name: Optional[str] = None
    location: ShopLocation
    offers: List[ShopOffer]
