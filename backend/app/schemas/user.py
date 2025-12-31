"""User-related Pydantic schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    minecraft_username: str
    minecraft_uuid: str

class UserCreate(UserBase):
    microsoft_id: str

class UserPreferences(BaseModel):
    theme: str = "dark"
    items_per_page: int = 20
    email: Optional[str] = None
    notify_trades: bool = False
    profile_public: bool = True
    show_playtime: bool = True
    
    class Config:
        from_attributes = True

class UserProfile(UserBase):
    id: str
    created_at: datetime
    last_login: datetime
    is_active: bool
    preferences: Optional[UserPreferences] = None
    
    class Config:
        from_attributes = True
