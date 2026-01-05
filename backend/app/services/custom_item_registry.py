# backend/app/services/custom_item_registry.py
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Define the Custom Item Registry
CUSTOM_ITEM_REGISTRY = {
    "HAVEN_CREST": {
        # 1. NBT Matching Data (must EXACTLY match what's in your YAML)
        "type": "minecraft:echo_shard",
        "display_name": "Echo Shard",
        # Lore from YAML - we'll do a flexible match
        "lore_fragment": 'text:"Official Minted Currency of Peaceful Haven"',
        
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
        
        # 1. Type Match (CRITICAL)
        if registry_type != item_type:
            continue
          
        # --- TEMPORARY DEBUGGING LOG ---
        if registry_type == 'minecraft:echo_shard':
            # This will print the exact lore your parser found!
            logger.error(f"!!! DEBUG LORE FOUND: {item_lore} !!!")
            logger.error(f"!!! DEBUG REQUIRED FRAGMENT: {registry_lore} !!!")
        # --- END DEBUG LOG ---

        # 2. Lore Match (The SOLE NBT Validator)
        # CRITICAL FIX: If lore is required, it must be present AND contain the fragment.
        if registry_lore:
            if not item_lore:
                continue # Item has no lore, but registry requires it
            
            is_lore_match = False
            for line in item_lore:
                line_str = str(line)
                if registry_lore in line_str:
                    is_lore_match = True
                    break
            
            if not is_lore_match:
                continue
        
        # All checks passed: Success
        return registry_item

    return None
