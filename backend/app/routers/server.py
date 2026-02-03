# backend/app/routers/server.py (Update /status endpoint)
from fastapi import APIRouter
from ..services.server_status import get_minecraft_server_status # <-- NEW IMPORT

router = APIRouter()

@router.get("/status", summary="Get the current live status of the Minecraft server")
async def get_server_status():
    """Returns live status, player count, and MOTD."""
    # The existing code now uses the new service
    status_data = await get_minecraft_server_status()
    return status_data

@router.get("/info", summary="Get server configuration and contact info")
async def get_server_info():
    """Returns static server information (e.g., rules, contact)."""
    # This endpoint remains static or connects to a DB for static info
    return {
        "name": "Haven SMP",
        "description": "Balanced Survival, Player-Driven Economy, Safe Community.",
        "discord_link": "https://discord.gg/MmUgh5YFvM",
        "rules_link": "/rules"
    }
