"""Service to parse Shopkeepers save.yml file"""
import yaml
from typing import List, Dict, Optional
from ..config import get_settings
from .nbt_parser import parse_nbt_enchantments, parse_nbt_container 

settings = get_settings()

def parse_item_data(item_dict: Optional[Dict]) -> Optional[Dict]:
    """Parse Minecraft item data from YAML"""
    if not item_dict:
        return None
    
    result = {
        "type": item_dict.get("id", "minecraft:unknown"),
        "amount": item_dict.get("count", 1),
        "display_name": None,
        "lore": None,
        "custom_model_data": None
    }
    
    components = item_dict.get("components", {})
    
    if components:
        # 1. Custom Name and Lore (Existing Logic)
        if "minecraft:custom_name" in components:
            result["display_name"] = components["minecraft:custom_name"]
        
        if "minecraft:lore" in components:
            result["lore"] = components["minecraft:lore"]

        # 2. NEW: Enchantments
        if "minecraft:enchantments" in components:
            enchant_str = str(components["minecraft:enchantments"]) # Ensure it's a string
            result["enchantments"] = parse_nbt_enchantments(enchant_str)
        
        # 3. NEW: Container Contents (Shulker Boxes)
        if "minecraft:container" in components:
            container_str = str(components["minecraft:container"])
            # The parsed contents are raw item dictionaries
            result["contents"] = parse_nbt_container(container_str)
            result["is_container"] = True # Mark as container for frontend display

        # 4. Custom Model Data
        if "minecraft:custom_model_data" in components:
            cmd = components["minecraft:custom_model_data"]
            if isinstance(cmd, dict) and "floats" in cmd:
                result["custom_model_data"] = int(cmd["floats"][0])
            elif isinstance(cmd, int):
                result["custom_model_data"] = cmd
    
    return result

def parse_shop_offers(offers_dict: Dict) -> List[Dict]:
    """Parse shop offers from YAML"""
    offers = []
    for offer_id, offer_data in offers_dict.items():
        offer = {
            "id": offer_id,
            "result": parse_item_data(offer_data.get("resultItem")),
            "cost1": parse_item_data(offer_data.get("item1")),
            "cost2": parse_item_data(offer_data.get("item2"))
        }
        offers.append(offer)
    return offers

def load_shops() -> List[Dict]:
    """Load all shops from save.yml"""
    try:
        with open(settings.SHOPKEEPERS_SAVE, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        if not data or not isinstance(data, dict):
            return []
        
        shops = []
        for shop_id, shop_data in data.items():
            if shop_id == 'data-version' or not isinstance(shop_data, dict):
                continue
            
            shop = {
                "id": shop_id,
                "uuid": shop_data.get("uniqueId"),
                "type": shop_data.get("type"),
                "name": shop_data.get("name", ""),
                "owner_uuid": shop_data.get("owner uuid"),
                "owner_name": shop_data.get("owner"),
                "location": {
                    "world": shop_data.get("world"),
                    "x": shop_data.get("x"),
                    "y": shop_data.get("y"),
                    "z": shop_data.get("z")
                }
            }
            
            if "offers" in shop_data:
                shop["offers"] = parse_shop_offers(shop_data["offers"])
            elif "recipes" in shop_data:
                shop["offers"] = parse_shop_offers(shop_data["recipes"])
            else:
                shop["offers"] = []
            
            shops.append(shop)
        
        return shops
    except Exception as e:
        print(f"Error loading shops: {e}")
        return []

def get_shop_by_uuid(shop_uuid: str) -> Optional[Dict]:
    """Get a specific shop by UUID"""
    shops = load_shops()
    for shop in shops:
        if shop["uuid"] == shop_uuid:
            return shop
    return None

def get_shops_by_owner(owner_uuid: str) -> List[Dict]:
    """Get all shops owned by a player"""
    shops = load_shops()
    return [shop for shop in shops if shop.get("owner_uuid") == owner_uuid]

def extract_all_available_trades() -> List[Dict]:
    """
    Loads all shops and flattens their trade offers into a single list.
    Also injects shop/owner metadata into each trade for filtering/display.
    """
    all_shops = load_shops()
    all_trades = []
    
    for shop in all_shops:
        if not shop.get("offers"):
            continue
            
        shop_metadata = {
            "shop_uuid": shop["uuid"],
            "shop_type": shop["type"],
            "shop_name": shop["name"],
            "owner_uuid": shop["owner_uuid"],
            "owner_name": shop["owner_name"],
            "location": shop["location"]
        }
        
        for trade in shop["offers"]:
            # Create a unique ID for the specific trade offer
            trade["trade_unique_id"] = f"{shop['uuid']}-{trade['id']}" 
            
            # Combine trade data with shop/owner metadata
            full_trade_record = {**shop_metadata, **trade}
            all_trades.append(full_trade_record)
            
    return all_trades
