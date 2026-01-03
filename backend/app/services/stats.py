# backend/app/services/stats.py
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from functools import lru_cache
from ..config import get_settings
from .player_status import load_user_cache # To resolve names

settings = get_settings()

@lru_cache(maxsize=1)
def load_all_leaderboards() -> Dict[str, List[Dict[str, Any]]]:
    """Reads all individual ranking JSON files into a single dictionary."""
    rankings_dir = Path(settings.MINECRAFT_STATS_DIR) / "data" / "rankings"
    
    if not rankings_dir.exists():
        print(f"WARN: Minecraft Stats directory not found at {rankings_dir}")
        return {}

    all_leaderboards = {}
    player_name_map = load_user_cache() # Get cached UUID->Name map
    
    for file_path in rankings_dir.glob("*.json"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Each file name is the stat name (e.g., 'aviate', 'kill_zombie')
                stat_name = file_path.stem 
                leaderboard = []
                
                for rank_data in data:
                    uuid = rank_data.get('uuid', '').lower()
                    
                    leaderboard.append({
                        "rank": rank_data.get('rank'),
                        "uuid": uuid,
                        "player_name": player_name_map.get(uuid, 'Unknown Player'), # Resolve name
                        "value": rank_data.get('value'),
                        "last_seen": rank_data.get('last_seen')
                    })

                all_leaderboards[stat_name] = leaderboard
                
        except Exception as e:
            print(f"ERROR reading stats file {file_path.name}: {e}")
            continue
            
    return all_leaderboards


def get_leaderboard(stat_name: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """Retrieves a specific cached leaderboard."""
    leaderboards = load_all_leaderboards()
    
    board = leaderboards.get(stat_name, [])
    
    return board[:limit] if limit else board
  
# Define a set of 'display stats' we want to show on the main page
TOP_STATS_DISPLAY = [
    "play", "walk", "mine_diamond_ore", "kill_any", "aviate"
    # Add more relevant, easy-to-read stats here
]

async def get_stats_dashboard() -> Dict[str, Any]:
    """
    Aggregates essential leaderboards and summary data for the frontend dashboard.
    Returns: { "summary": {total_players: ...}, "leaderboards": [ {stat_name: ..., top_players: [...]}, ... ] }
    """
    all_boards = load_all_leaderboards()
    player_name_map = load_user_cache() # Get names for all players

    dashboard_data = {
        "summary": {
            "total_stats_available": len(all_boards),
            "total_players_cached": len(player_name_map)
        },
        "leaderboards": [],
        "awards_overview": []
    }

    # 1. Get Top N Leaderboards (e.g., Top 5 players for key stats)
    for stat_name in TOP_STATS_DISPLAY:
        board = all_boards.get(stat_name)
        if board:
            dashboard_data["leaderboards"].append({
                "stat_id": stat_name,
                "stat_label": stat_name.replace('_', ' ').title(), # Simple label conversion
                "top_players": board[:5] # Get top 5 players
            })

    # 2. Get the Hall of Fame/Awards Overview (We need to process ALL data for this)
    # This requires looking at every player's rank across all stats.
    # For now, we'll return the raw awards files and let the frontend render the list of available stats.
    
    # We will simply return a list of all available stat IDs for the awards overview
    dashboard_data["awards_overview"] = [
        {"id": k, "label": k.replace('_', ' ').title()} for k in all_boards.keys()
    ]


    return dashboard_data
