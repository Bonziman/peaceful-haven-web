# backend/app/services/stock.py
import json
from pathlib import Path
from typing import Dict, Optional
from functools import lru_cache
from ..config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

@lru_cache(maxsize=1)
def load_stock_map() -> Dict[str, int]:
    """
    Loads stock data from the JSON file and creates a map for fast lookup.
    
    File format: [{"shop_uuid": "...", "item_type": "minecraft:elytra", "stock_remaining": 34}, ...]
    Map format: { 'shop_uuid-item_type': stock_remaining, ... }
    
    Returns: Dictionary mapping shop_uuid-item_type to stock count
    """
    path = Path(settings.STOCK_FILE_PATH)
    stock_map = {}
    
    if not path.exists():
        logger.warning(f"Stock file not found at {path}")
        return stock_map
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            for item in data:
                shop_uuid = item.get('shop_uuid')
                item_type = item.get('item_type')
                stock = item.get('stock_remaining')
                
                # Only add valid entries
                if shop_uuid and item_type and stock is not None:
                    key = f"{shop_uuid}-{item_type}"
                    stock_map[key] = stock
            
            logger.info(f"Loaded {len(stock_map)} stock entries from {path}")
            return stock_map
        
    except Exception as e:
        logger.error(f"Failed to load stock file: {e}", exc_info=True)
        return {}


def get_stock_count(shop_uuid: str, result_item_type: str) -> Optional[int]:
    """
    Looks up stock for a specific item in a shop.
    
    Args:
        shop_uuid: UUID of the shop
        result_item_type: Item type from the trade (e.g., "minecraft:elytra")
    
    Returns:
        Stock count (int) if found, None if not in stock file
    """
    if not shop_uuid or not result_item_type:
        return None
    
    stock_map = load_stock_map()
    key = f"{shop_uuid}-{result_item_type}"
    return stock_map.get(key)  # Returns None if key not found


def clear_stock_cache():
    """Clear the cached stock map (call when file is updated)."""
    load_stock_map.cache_clear()
    logger.info("Stock cache cleared")
