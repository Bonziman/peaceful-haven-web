# backend/app/services/server_status.py
import asyncio
from typing import Dict, Any
from mcstatus.server import JavaServer as AsyncJavaServer 
from ..config import get_settings

settings = get_settings()

async def get_minecraft_server_status() -> Dict[str, Any]:
    """Queries the Minecraft server directly for live status and player count."""
    
    # Use the mcstatus library to query the host and port from config
    host = settings.MC_SERVER_HOST
    port = settings.MC_SERVER_PORT
    
    try:
        # FIX 2: Use the ASYNC JavaServer object creation
        server = AsyncJavaServer.lookup(f"{host}:{port}")
        
        # FIX 3: Ping and Status calls are now correct with 'await'
        latency = await asyncio.wait_for(server.async_ping(), timeout=3.0) # Use async_ping()
        status = await asyncio.wait_for(server.async_status(), timeout=3.0) # Use async_status()
        
        # Build the structured response
        players_list = [player.name for player in status.players.sample] if status.players.sample else []
        
        return {
            "online": True,
            "players": {
                "online": status.players.online,
                "max": status.players.max,
                "sample": players_list
            },
            "version": status.version.name,
            "motd": status.description,
            "latency": round(latency, 2),
            "error": None
        }

    except TimeoutError:
        return {
            "online": False,
            "players": None,
            "version": None,
            "motd": "Server query timed out.",
            "latency": None,
            "error": "Timeout"
        }
    except Exception as e:
        # Catch connection errors (e.g., ConnectionRefusedError)
        return {
            "online": False,
            "players": None,
            "version": None,
            "motd": "Server is offline or unreachable.",
            "latency": None,
            "error": str(e)
        }
