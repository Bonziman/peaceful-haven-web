"""Server status schemas"""
from pydantic import BaseModel
from typing import List, Optional

class ServerPlayers(BaseModel):
    """Server player info"""
    online: int
    max: int
    sample: Optional[List[str]] = None

class ServerStatus(BaseModel):
    """Complete server status"""
    online: bool
    players: Optional[ServerPlayers] = None
    version: Optional[str] = None
    motd: Optional[str] = None
    latency: Optional[float] = None
    error: Optional[str] = None
