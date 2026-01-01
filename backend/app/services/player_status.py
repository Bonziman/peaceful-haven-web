# backend/app/services/player_status.py (FINAL COMPLETE VERSION)
import json
from pathlib import Path
from typing import Set, Dict, Any, Optional, Tuple
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
        print(f"WARN: Banned players file not found at {path}")
        return set()
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Assuming the JSON is a list of objects, each with a 'uuid' field
            return {item.get('uuid', '').lower() for item in data if item.get('uuid')}
    except Exception as e:
        print(f"ERROR reading banned players JSON: {e}")
        return set()

def is_player_banned_by_uuid(uuid: str) -> bool:
    """Checks if a given UUID is in the banned list."""
    # We will assume a cache refresh only happens on app restart for performance
    return uuid.lower() in load_banned_uuids()

# ============================================
# UUID/Name Lookup Functions (for name/login check)
# ============================================

@lru_cache(maxsize=1) 
def load_user_cache() -> Dict[str, Any]:
    """
    Loads usercache.json into a map of UUID -> Name for quick lookup.
    Returns: Dict[UUID: str, Name: str]
    """
    path = Path(settings.USERCACHE_JSON)
    uuid_to_name = {}
    if not path.exists():
        print(f"WARN: User cache file not found at {path}")
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
    except Exception as e:
        print(f"ERROR loading user cache: {e}")
    
    return uuid_to_name

def get_player_name_by_uuid(uuid: str) -> Optional[str]:
    """
    Retrieves a player's name from the user cache by their UUID.
    This is used by the /players/{uuid}/status endpoint.
    """
    cache = load_user_cache()
    return cache.get(uuid.lower())


def has_player_logged_in(uuid: str) -> bool:
    """
    Checks if a player's UUID is in the user cache, meaning they have logged in before.
    """
    cache = load_user_cache()
    # Check both the cache and the playtime DB for a more definitive check
    # For now, we rely only on usercache.
    return uuid.lower() in cache

# ============================================
# Core Status Check
# ============================================

async def check_player_status(uuid: str) -> Tuple[bool, bool]:
    """
    Core function called by the auth flow to check player eligibility.
    Returns: (is_banned, has_logged_in)
    """
    is_banned = is_player_banned_by_uuid(uuid)
    
    # Check usercache (primary check for 'has played before')
    has_logged_in = has_player_logged_in(uuid) 
    
    # TODO (Future): Add check for Playtime DB as a secondary source if usercache is unreliable.
    
    return is_banned, has_logged_in
