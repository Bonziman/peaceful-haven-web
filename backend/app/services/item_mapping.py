# app/services/item_mapping.py
import httpx
import asyncio
from typing import Dict, Any, Optional
from ..config import get_settings

settings = get_settings()

# We will fetch the data from the /api/items endpoint
MINECRAFT_API_URL = "https://minecraft-api.vercel.app/api/items" 

ITEM_MAP_CACHE: Dict[str, Any] = {}

def sync_fetch_item_data() -> Dict[str, Any]:
    """Synchronous function to fetch the item data and map it to Minecraft IDs."""
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(MINECRAFT_API_URL)
            response.raise_for_status()
            items_list = response.json()
            
            item_map = {}
            for item in items_list:
                namespaced_id = item.get('namespacedId', '').lower() # e.g., 'acacia_boat'
                if not namespaced_id:
                    continue

                # The full Minecraft ID (e.g., 'minecraft:acacia_boat')
                full_id = f"minecraft:{namespaced_id}" 
                
                # We need to map the ID to a standardized object containing the name and image URL.
                standard_item_data = {
                    "name": item.get('name'), 
                    "icon_url": item.get('image'), # The full URL, e.g., .../acacia_boat.png
                }

                # 1. Store by FULL ID (what comes from the YAML): 'minecraft:acacia_boat'
                item_map[full_id] = standard_item_data
                
                # 2. Store by SHORT ID (the namespacedId): 'acacia_boat'
                # This helps catch items where the YAML might omit 'minecraft:' or if we search by short name.
                item_map[namespaced_id] = standard_item_data
            
            return item_map
            
    except httpx.HTTPStatusError as e:
        print(f"ERROR: Failed to fetch item data: HTTP Status {e.response.status_code}")
    except Exception as e:
        print(f"ERROR: Failed to fetch item data: {e}")
        
    return {}

async def load_item_map_cache():
    """Populates the global cache using a separate thread."""
    global ITEM_MAP_CACHE
    print("Pre-loading Minecraft item data from external API...")
    ITEM_MAP_CACHE = await asyncio.to_thread(sync_fetch_item_data)
    print(f"✓ Loaded {len(ITEM_MAP_CACHE)} item definitions.")

def get_item_info(item_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves cached info for a single item ID (synchronous access)."""
    
    # 1. Check for the full ID (e.g., 'minecraft:diamond')
    full_id = item_id.lower()
    info = ITEM_MAP_CACHE.get(full_id)
    if info:
        return info
    
    # 2. Check for the short ID (e.g., 'diamond')
    short_id = full_id.split(':')[-1]
    info = ITEM_MAP_CACHE.get(short_id)
    
    return info

async def enrich_item_data(item_data: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Enriches an item dictionary with friendly name and icon URL."""
    if not item_data or not item_data.get('type'):
        return item_data
    
    custom_display_name = item_data.get("display_name")
    
    item_id = item_data['type'] 
    item_info = get_item_info(item_id) # Synchronous call to cached data
    
    if item_info:
        # 2. ALWAYS try to get the icon URL from the API data ('image' is now 'icon_url')
        item_data['icon_url'] = item_info.get('icon_url')
        
        # 3. Use the CUSTOM name if it exists; otherwise, use the API name
        if custom_display_name:
            item_data['display_name'] = custom_display_name
        else:
            # item_info['name'] holds the friendly name from the public API
            item_data['display_name'] = item_info.get('name', item_id)
            
    else:
        # Fallback for custom/modded items not in the API:
        if not custom_display_name:
            item_data['display_name'] = item_id.replace('minecraft:', '').replace('_', ' ').title()
            
        item_data['icon_url'] = None
        
    return item_data
