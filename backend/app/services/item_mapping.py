import httpx
import asyncio
import logging
from typing import Dict, Any, Optional
from ..config import get_settings
from .custom_item_registry import lookup_custom_item

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
    """Enriches an item dictionary with friendly name and icon URL, prioritizing custom registry."""
    logger = logging.getLogger(__name__)
    
    if not item_data:
        logger.debug("[enrich_item_data] Received empty item_data")
        return item_data
    
    if not item_data.get('type'):
        logger.debug("[enrich_item_data] Item has no type")
        return item_data
    
    logger.debug(f"[enrich_item_data] Starting enrichment for: {item_data.get('type')}")
    
    # --- 1. CHECK CUSTOM ITEM REGISTRY FIRST ---
    custom_item_info = lookup_custom_item(item_data)
    
    if custom_item_info: # <-- This condition is now TRUE due to successful lore matching
        logger.info(f"[enrich_item_data] ✓ Custom item matched! Setting custom display")
        item_data['display_name'] = custom_item_info['web_name'] 
        item_data['icon_url'] = custom_item_info['web_icon']    
        item_data['is_custom'] = True # <--- THIS IS THE LINE THAT SETS IT TO TRUE
        logger.debug(f"[enrich_item_data] Set: display_name={custom_item_info['web_name']}, icon_url={custom_item_info['web_icon']}")
        return item_data
    
    # --- 2. NOT IN CUSTOM REGISTRY - Use Public API ---
    # Check for existing custom name (from YAML)
    custom_display_name = item_data.get("display_name")
    
    # 3. Proceed with Public API Lookup
    item_id = item_data['type'] 
    item_info = get_item_info(item_id) 
    
    if item_info:
        logger.debug(f"[enrich_item_data] Found in public API: {item_id}")
        # 3a. ALWAYS try to get the icon URL from the API data
        item_data['icon_url'] = item_info.get('icon_url')
        
        # 3b. Use the CUSTOM name if it exists; otherwise, use the API name
        if custom_display_name:
            # Preserve the custom name (e.g., the raw JSON text component)
            item_data['display_name'] = custom_display_name
        else:
            # Use the friendly name from the Public API (e.g., "Diamond Block")
            item_data['display_name'] = item_info.get('name', item_id)
            
    else:
        logger.debug(f"[enrich_item_data] NOT found in public API: {item_id}")
        # 4. Fallback for completely unknown/unregistered items (e.g., modded item)
        if not custom_display_name:
            # If no custom name is present, format the ID as the display name
            item_data['display_name'] = item_id.replace('minecraft:', '').replace('_', ' ').title()
            
        item_data['icon_url'] = None # No icon available

    # 5. CRITICAL FIX: Explicitly set is_custom to False for all non-matched items
    item_data['is_custom'] = False
    logger.error(f"FINAL ENRICHED DATA FOR {item_data.get('type')}: is_custom={item_data.get('is_custom')}, display_name={item_data.get('display_name')}")
    
    return item_data
