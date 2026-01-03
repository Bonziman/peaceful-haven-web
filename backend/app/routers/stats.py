# backend/app/routers/stats.py
from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from ..services.stats import get_leaderboard, load_all_leaderboards, get_stats_dashboard

router = APIRouter()

@router.get("/", summary="Get a list of all available statistics")
async def list_available_stats():
    """Returns a list of all available leaderboard IDs (stat file names)."""
    boards = load_all_leaderboards()
    return {"available_stats": list(boards.keys()), "count": len(boards)}

@router.get("/leaderboard/{stat_name}", summary="Get the leaderboard for a specific statistic")
async def get_stats_leaderboard(
    stat_name: str,
    limit: int = Query(20, gt=0, le=100)
) -> List[Dict[str, Any]]:
    """Returns the top players for a given statistic (e.g., 'kill_zombie', 'mine_diamond_ore')."""
    
    leaderboard = get_leaderboard(stat_name, limit)
    
    if not leaderboard:
        # Check if the stat name is valid but the board is empty
        if stat_name in load_all_leaderboards():
             return []
        # Or if the stat name is invalid
        raise HTTPException(status_code=404, detail=f"Statistic '{stat_name}' not found.")
        
    return leaderboard


@router.get("/dashboard", summary="Get aggregated stats for the main dashboard and awards overview")
async def get_dashboard_stats() -> Dict[str, Any]:
    """
    Returns a single payload containing essential leaderboards and data needed for the Stats Home Page.
    """
    return await get_stats_dashboard() # <-- Call the new service function
