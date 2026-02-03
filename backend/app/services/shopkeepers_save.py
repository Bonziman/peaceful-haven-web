# app/services/shopkeepers_save.py
import yaml
from pathlib import Path
from typing import List, Dict, Any
from ..config import get_settings

settings = get_settings()

def get_active_shops_data() -> Dict[str, Any]:
    """Reads and parses the Shopkeepers save.yml file."""
    save_file_path = Path(settings.SHOPKEEPERS_SAVE)
    
    if not save_file_path.exists():
        # Log this error! The volume mount failed or the file is missing.
        print(f"ERROR: Shopkeepers save file not found at {save_file_path}")
        return {}
    
    with open(save_file_path, 'r') as f:
        # Shopkeepers YAML format can be complex, you may need a safe_load or a custom loader
        # based on the exact structure, but start with safe_load.
        data = yaml.safe_load(f)
        
    return data

def extract_trades_from_shops(shops_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Iterates through the shops data to extract a flattened list of available trades."""
    all_trades = []
    
    # The structure of the Shopkeepers save.yml can be complex. You will need to inspect
    # the actual file to determine the keys for iterating over shops and then their trades.
    # Assuming the shops are keyed by UUID and have a 'trades' list:
    
    for shop_uuid, shop_details in shops_data.items():
        # Check if shop_uuid is actually a UUID and not some metadata key
        if 'trades' in shop_details and shop_details.get('deleted') is not True:
            shop_owner_uuid = shop_details.get('owner', 'N/A')
            shop_owner_name = "TODO: Lookup Name" # This requires looking up UUID in usercache.json
            
            for trade in shop_details['trades']:
                # The trade object will contain item IDs and counts for both offers and result.
                # Example:
                trade_info = {
                    "shop_uuid": shop_uuid,
                    "shop_owner_uuid": shop_owner_uuid,
                    "shop_owner_name": shop_owner_name,
                    # You'll need to parse the item details from the trade structure
                    "offer_1_item_id": trade.get('item1', {}).get('type'),
                    "offer_1_amount": trade.get('item1', {}).get('amount'),
                    "result_item_id": trade.get('result', {}).get('type'),
                    "result_amount": trade.get('result', {}).get('amount'),
                    # ... more trade details
                }
                all_trades.append(trade_info)
                
    return all_trades

# Utility to look up player names from UUIDs using usercache.json
# You can use the json built-in library for this.
def get_player_name_from_uuid(uuid: str) -> str:
    # TODO: Implement reading the usercache.json (mounted at /minecraft/usercache.json)
    # The usercache is a list of objects with 'name', 'uuid', and 'expiresOn'.
    # This function will be needed in many services.
    pass
