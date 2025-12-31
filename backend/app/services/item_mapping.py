# app/services/item_mapping.py
import httpx
from typing import Dict, Any, Optional
from functools import lru_cache
from ..config import get_settings

settings = get_settings()

MINECRAFT_API_URL = "https://minecraft-api.vercel.app/api/items"

@lru_cache(maxsize=1)
async def fetch_item_data() -> Dict[str, Any]:
    """Fetches and caches the full list of Minecraft items from the public API."""
    try:
        # Use httpx to make an async request (you have it in requirements.txt)
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(MINECRAFT_API_URL)
            response.raise_for_status() # Raise an exception for bad status codes
            items_list = response.json()
            
            # Convert list to a dictionary for fast lookup: item_id -> item_data
            # IDs are typically lowercase: 'minecraft:iron_ingot'
            item_map = {item.get('id', '').lower(): item for item in items_list}
            
            # Also handle older ID format without 'minecraft:' prefix
            for item in items_list:
                item_map[item.get('id', '').split(':')[-1].lower()] = item
            
            return item_map
            
    except httpx.HTTPStatusError as e:
        print(f"ERROR: Failed to fetch item data: HTTP Status {e.response.status_code}")
    except Exception as e:
        print(f"ERROR: Failed to fetch item data: {e}")
        
    return {}

async def get_item_info(item_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves cached info for a single item ID."""
    item_map = await fetch_item_data()
    # Check both 'minecraft:id' and 'id' format
    return item_map.get(item_id.lower()) or item_map.get(item_id.split(':')[-1].lower())

async def enrich_item_data(item_data: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Enriches an item dictionary with friendly name and icon URL."""
    if not item_data or not item_data.get('type'):
        return item_data
    
    # Use existing display_name if it's a custom item from the YAML
    if item_data.get("display_name"):
        return item_data

    item_id = item_data['type'] # e.g., 'minecraft:firework_rocket'
    item_info = await get_item_info(item_id)
    
    if item_info:
        item_data['display_name'] = item_info.get('name', item_id)
        item_data['icon_url'] = item_info.get('icon')
        item_data['api_data'] = item_info # Optional: keep the raw API data
    else:
        # Fallback if the item is not in the public API (e.g., custom modded items)
        item_data['display_name'] = item_id.replace('minecraft:', '').replace('_', ' ').title()
        item_data['icon_url'] = None # No icon available
        
    return item_data
