# backend/app/services/custom_item_registry.py
from typing import Dict, Any, Optional
import logging
import json 

logger = logging.getLogger(__name__)

# Define the Custom Item Registry
CUSTOM_ITEM_REGISTRY = {
    "HAVEN_CREST": {
        # 1. NBT Matching Data (must EXACTLY match what's in your YAML)
        "type": "minecraft:echo_shard",
        "display_name": "Echo Shard",
        # Lore from YAML - we'll do a flexible match
        "lore_fragment": '[{color:"gold",italic:0b,text:"Official Minted Currency of Peaceful Haven"}]',
        
        # 2. Web/Display Data
        "web_name": "Haven Crest",
        "web_icon": "/images/custom/Haven-Crest.gif",
        "is_custom": True
    },
}

def lookup_custom_item(item_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Looks up an item in the custom registry based on its type and NBT data.
    """
    if not item_data:
        return None
    
    item_type = item_data.get('type', '').lower()
    item_lore = item_data.get('lore')
    
   
    
    if not item_type:
        return None

    for key, registry_item in CUSTOM_ITEM_REGISTRY.items():
        registry_type = registry_item["type"].lower()
        registry_lore = registry_item.get("lore_fragment", "")
        
        # 2. Lore Match (The SOLE NBT Validator)
        if registry_lore:
            if not item_lore:
                continue
            
            # The item_lore is the string from the JSON: "[{color:"gold",italic:0b,text:"..."}]"
            # We simply check if the registry fragment is a substring of the single item_lore string.
            if isinstance(item_lore, str): # <-- Ensure we check a string against a string
                if registry_lore in item_lore:
                    return registry_item
                
                # Check 1: Simple text fragment
                if registry_lore in line_str: 
                    is_lore_match = True
                    break
                
                # Check 2 (Fallback if simple text fails): check for single-quoted version
                # The text may be double-quoted in the log but single-quoted in str(dict)
                if f"'{registry_lore}'" in line_str:
                    is_lore_match = True
                    break
                
            if not is_lore_match:
                # Your log shows this is the path being taken!
                continue
        
        # All checks passed: Success
        return registry_item

    return None
