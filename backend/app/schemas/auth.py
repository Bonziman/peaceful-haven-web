"""Authentication-related Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    """Data stored in JWT token"""
    user_id: str
    minecraft_uuid: str

class MicrosoftAuthCallback(BaseModel):
    """Microsoft OAuth callback data"""
    code: str
    state: Optional[str] = None

class MinecraftProfile(BaseModel):
    """Minecraft profile from Microsoft"""
    uuid: str
    username: str
    microsoft_id: str
