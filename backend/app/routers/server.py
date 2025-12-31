"""Server router - Server status and info"""
from fastapi import APIRouter
from mcstatus import JavaServer
from ..config import get_settings
from ..schemas.server import ServerStatus, ServerPlayers

router = APIRouter()
settings = get_settings()

@router.get("/status", response_model=ServerStatus)
async def get_server_status():
    """Get current Minecraft server status"""
    try:
        # Query the server
        server = JavaServer.lookup(f"{settings.MC_SERVER_HOST}:{settings.MC_SERVER_PORT}")
        status = await server.async_status()
        
        # Get player sample (if available)
        player_sample = None
        if status.players.sample:
            player_sample = [p.name for p in status.players.sample]
        
        return {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max,
                "sample": player_sample
            },
            "version": status.version.name,
            "motd": status.description,
            "latency": status.latency
        }
    except Exception as e:
        return {
            "online": False,
            "error": str(e)
        }

@router.get("/info")
async def get_server_info():
    """Get general server information"""
    return {
        "name": "Peaceful Haven",
        "description": "A peaceful Minecraft community server",
        "domain": "play.peacefulhaven.lol",
        "version": "Paper 1.21.10",
        "features": [
            "Economy System",
            "Player Shops",
            "Cross-play (Java & Bedrock)",
            "Custom Items"
        ]
    }
