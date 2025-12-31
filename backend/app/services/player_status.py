# app/services/player_status.py
import json
from pathlib import Path
from typing import Set, Optional, Dict
from functools import lru_cache
from ..config import get_settings

settings = get_settings()

# ============================================
# Ban List Functions
# ============================================

@lru_cache(maxsize=1) 
def load_banned_uuids() -> Set[str]:
    """Loads a set of banned UUIDs from the JSON file."""
    path = Path(settings.BANNED_PLAYERS_JSON)
    if not path.exists():
        return set()
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Ban JSON format is typically a list of dicts with a 'uuid' key
            return {item.get('uuid', '').lower() for item in data if item.get('uuid')}
    except Exception as e:
        print(f"Error loading banned players: {e}")
        return set()

def is_player_banned(uuid: str) -> bool:
    """Checks if a given UUID is in the banned list."""
    # Clear cache if needed for real-time ban checks, but lru_cache is fine for low-frequency changes
    return uuid.lower() in load_banned_uuids()

# ============================================
# UUID/Name Lookup Functions (for name/login check)
# ============================================

@lru_cache(maxsize=1) 
def load_user_cache() -> Dict[str, str]:
    """Loads a map of UUID -> Name and Name -> UUID from usercache.json."""
    path = Path(settings.USERCACHE_JSON)
    uuid_to_name = {}
    name_to_uuid = {}
    if not path.exists():
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # usercache is a list of dicts: {'name', 'uuid', 'expiresOn'}
            for item in data:
                uuid = item.get('uuid', '').lower()
                name = item.get('name')
                if uuid and name:
                    uuid_to_name[uuid] = name
                    name_to_uuid[name.lower()] = uuid
    except Exception as e:
        print(f"Error loading user cache: {e}")
    
    return {"uuid_to_name": uuid_to_name, "name_to_uuid": name_to_uuid}

def get_player_name_by_uuid(uuid: str) -> Optional[str]:
    """Looks up player name from usercache by UUID."""
    cache = load_user_cache()
    return cache.get("uuid_to_name", {}).get(uuid.lower())

def has_player_logged_in(uuid: str) -> bool:
    """Checks if a player's UUID is in the user cache."""
    return get_player_name_by_uuid(uuid) is not None
