# backend/app/services/nbt_parser.py
import json
import re
from typing import Dict, Any, List, Optional
import logging
import yaml

logger = logging.getLogger(__name__)

# --- Enchantment Name Mapping (for display) ---
ENCHANT_MAP = {
    "minecraft:protection": "Protection",
    "minecraft:fire_protection": "Fire Protection",
    "minecraft:blast_protection": "Blast Protection",
    "minecraft:projectile_protection": "Projectile Protection",
    "minecraft:thorns": "Thorns",
    "minecraft:respiration": "Respiration",
    "minecraft:aqua_affinity": "Aqua Affinity",
    "minecraft:depth_strider": "Depth Strider",
    "minecraft:frost_walker": "Frost Walker",
    "minecraft:soul_speed": "Soul Speed",
    "minecraft:sharpness": "Sharpness",
    "minecraft:smite": "Smite",
    "minecraft:bane_of_arthropods": "Bane of Arthropods",
    "minecraft:knockback": "Knockback",
    "minecraft:fire_aspect": "Fire Aspect",
    "minecraft:looting": "Looting",
    "minecraft:efficiency": "Efficiency",
    "minecraft:silk_touch": "Silk Touch",
    "minecraft:unbreaking": "Unbreaking",
    "minecraft:fortune": "Fortune",
    "minecraft:power": "Power",
    "minecraft:punch": "Punch",
    "minecraft:flame": "Flame",
    "minecraft:infinity": "Infinity",
    "minecraft:luck_of_the_sea": "Luck of the Sea",
    "minecraft:lure": "Lure",
    "minecraft:multishot": "Multishot",
    "minecraft:piercing": "Piercing",
    "minecraft:quick_charge": "Quick Charge",
    "minecraft:loyalty": "Loyalty",
    "minecraft:riptide": "Riptide",
    "minecraft:channeling": "Channeling",
    "minecraft:impaling": "Impaling",
    "minecraft:sweeping": "Sweeping Edge",
    "minecraft:mending": "Mending",
    "minecraft:curse_of_binding": "Curse of Binding",
    "minecraft:curse_of_vanishing": "Curse of Vanishing",
    "minecraft:swift_sneak": "Swift Sneak",
    "minecraft:density": "Density",               # Newer enchantment introduced in 1.21
    "minecraft:snare_burst": "Snare Burst",       # Another new enchantment in 1.21
    "minecraft:rift": "Rift"                      # Added in 1.21 generation
}


def parse_nbt_enchantments(enchant_str: str) -> List[Dict[str, Any]]:
    """
    Parses the string-encoded JSON for enchantments: '{"minecraft:protection":4, ...}'
    Returns: List of {name, level}
    """
    enchantments = []
    if not enchant_str:
        return enchantments
        
    try:
        # The string might not be strict JSON due to single quotes or unquoted keys/values.
        # Use regex to convert to JSON format first (replace single quotes/unquoted keys)
        # However, for the simple Shopkeepers format, direct loading might work.
        
        # 1. Safely load the string as JSON
        # Note: The JSON string might contain single quotes, so we replace them first
        json_str = enchant_str.replace("'", '"')
        data = json.loads(json_str)

        # 2. Convert map to structured list
        for key, level in data.items():
            enchantments.append({
                "id": key,
                "name": ENCHANT_MAP.get(key, key.replace('minecraft:', '').title()), # Get display name
                "level": level
            })
            
    except json.JSONDecodeError as e:
        logger.warning(f"Failed to parse enchantments JSON string: {enchant_str[:50]}... Error: {e}")
        # Return empty list on failure
        return []
    
    return enchantments


def parse_nbt_container(container_str: str) -> List[Dict[str, Any]]:
    """
    Parses the string-encoded YAML array for container contents (e.g., Shulker Box).
    """
    contents = []
    if not container_str:
        return contents
        
    try:
        # --- FIX: Use yaml.safe_load to parse the non-standard JSON/YAML string ---
        # 1. Use safe_load to parse the complex NBT string
        data = yaml.safe_load(container_str)
        
        # 2. Extract item data from each slot (data is now a list of slot objects)
        for slot_data in data:
            item_data = slot_data.get('item')
            slot = slot_data.get('slot')
            
            if item_data:
                # The item_data still contains the raw NBT data which needs recursive parsing
                # We will mark it with slot info for the frontend
                item_data['slot'] = slot 
                contents.append(item_data)

    except yaml.YAMLError as e:
        logger.warning(f"Failed to parse container YAML string: {container_str[:50]}... Error: {e}")
        return []
    except Exception as e:
        logger.warning(f"Failed to process container data: {e}")
        return []
        
    return contents
