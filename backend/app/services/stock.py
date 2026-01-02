# backend/app/services/stock.py
import json
from pathlib import Path
from typing import Dict, Any, Optional
from functools import lru_cache
from ..config import get_settings

settings = get_settings()

@lru_cache(maxsize=1)
def load_stock_map() -> Dict[str, int]:
    """
    Loads stock data from the JSON file and maps it to a unique Trade ID for fast lookup.
    Returns: { 'shop_uuid-trade_id': stock_remaining, ... }
    """
    path = Path(settings.STOCK_FILE_PATH)
    stock_map = {}
    
    # 1. Handle File Not Found (Safety check for when the Java plugin isn't deployed)
    if not path.exists():
        print(f"WARN: Stock file not found at {path}. Returning empty stock.")
        return {}
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            for item in data:
                shop_uuid = item.get('shop_uuid')
                trade_id = item.get('trade_id')
                stock = item.get('stock_remaining')
                
                if shop_uuid and trade_id is not None and stock is not None:
                    # Create the unique key used to look up the trade
                    key = f"{shop_uuid}-{trade_id}"
                    stock_map[key] = stock
            
        return stock_map
        
    except Exception as e:
        print(f"ERROR reading stock JSON: {e}")
        return {}

def get_stock_count(shop_uuid: str, trade_id: str) -> Optional[int]:
    """Looks up the remaining stock for a specific trade offer."""
    stock_map = load_stock_map()
    key = f"{shop_uuid}-{trade_id}"
    return stock_map.get(key)
