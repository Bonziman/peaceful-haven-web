# backend/app/services/automation.py (FINAL COMPLETE VERSION)

import json
import os
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from ..config import get_settings

settings = get_settings()

# --- NEW CONSTANTS AND MAPPINGS ---

# Define the exact products and prices you will create in your Ko-fi Shop
DONATION_MAP = {
    # Supporter Tiers
    ("Supporter (1 Month)", 5.00):     {"rank": "supporter", "days": 30},
    ("Supporter (3 Months)", 12.00):    {"rank": "supporter", "days": 90},
    ("Supporter (6 Months)", 20.00):    {"rank": "supporter", "days": 180},
    ("Supporter (12 Months)", 35.00):   {"rank": "supporter", "days": 365}, 
    
    # Supporter Plus Tiers
    ("Supporter Plus (1 Month)", 12.00): {"rank": "supporter_plus", "days": 30},
    ("Supporter Plus (3 Months)", 30.00): {"rank": "supporter_plus", "days": 90},
    ("Supporter Plus (6 Months)", 55.00): {"rank": "supporter_plus", "days": 180},
    ("Supporter Plus (12 Months)", 100.00): {"rank": "supporter_plus", "days": 365},
    
    # Patron Tiers (Permanent price based on your final decision: $160.00 USD equivalent)
    ("Patron (1 Month)", 20.00):  {"rank": "patron", "days": 30},
    ("Patron (3 Months)", 50.00):  {"rank": "patron", "days": 90},
    ("Patron (6 Months)", 90.00):  {"rank": "patron", "days": 180},
    ("Patron (Permanent)", 160.00): {"rank": "patron", "days": 9999, "perm": True},
}

# Item Delivery Map (Uses Ko-fi's 'direct_link_code' as the unique key)
ITEM_DELIVERY_MAP = {
    # Test codes from your previous example:
    "1a2b3c4d5e": {"item_id": "DIAMOND", "is_perk": False, "note": "Placeholder Diamond"},
    "a1b2c3d4e5": {"item_id": "NETHERITE_INGOT", "is_perk": True, "note": "Placeholder Netherite"},
}

# --- Pydantic Models ---

class ProcessedDonation(BaseModel):
    ign: str
    amount: float
    product_name: str
    duration_days: int
    rank_key: str
    is_permanent: bool = False

class QueuedCommand(BaseModel):
    id: str
    command: str
    timestamp: str


# --- Core Logic Functions ---

def parse_player_ign(data: Dict[str, Any]) -> Optional[str]:
    """Extracts the player's IGN from various fields."""
    message = data.get('message', '')
    
    # 1. Prioritize Discord Username (Use name without tag)
    discord_tag = data.get('discord_username')
    
    if discord_tag:
        # Check for the tag (e.g., 'Jo#4105') but use the name part
        ign_match = discord_tag.split('#')[0].strip() 
        if ign_match:
            return ign_match
        
    # 2. Check for explicit IGN in the message
    if isinstance(message, str) and 'IGN:' in message:
        try:
            # Simple split logic (assuming clean message)
            ign_match = message.split('IGN:')[1].strip().split(' ')[0]
            if ign_match:
                return ign_match
        except:
            pass
        
    # 3. Fallback to the 'from_name' which is always present
    return data.get('from_name')


def generate_server_command(ign: str, action: str, details: Dict[str, Any]) -> str:
    """Generates the command to be executed by the Minecraft plugin."""
    
    if action == "rank_grant":
        duration_str = "permanent" if details.get('is_permanent') else f"{details['duration_days']}d"
        # Format: /webperks grant_rank {player} {rank_key} {duration}
        return f"webperks grant_rank {ign} {details['rank_key']} {duration_str}"
        
    if action == "item_delivery":
        # Format: /webperks deliver_item {player} {item_id} {quantity}
        return f"webperks deliver_item {ign} {details['item_id']} {details['quantity']}"

    return "" 


def get_command_queue_path() -> Path:
    """Returns the pathlib Path object for the command queue file."""
    return Path(settings.COMMAND_QUEUE_PATH)


def queue_server_command(command: str):
    """
    Appends a new command to the central JSON queue file.
    Uses file locking or thread-safe write for data integrity.
    """
    queue_path = get_command_queue_path()
    
    new_command = QueuedCommand(
        id=os.urandom(8).hex(), # Simple unique ID
        command=command,
        timestamp=datetime.now(timezone.utc).isoformat()
    ).model_dump()
    
    # 1. Ensure the directory exists
    queue_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 2. Safely read, append, and write back (using a temporary file write for safety)
    try:
        # Read existing commands (or initialize empty list)
        if queue_path.exists() and queue_path.stat().st_size > 0:
            with open(queue_path, 'r') as f:
                commands = json.load(f)
        else:
            commands = []
            
        commands.append(new_command)
        
        # Write to a temporary file first, then rename (atomic write for integrity)
        temp_path = queue_path.with_suffix('.tmp')
        with open(temp_path, 'w') as f:
            json.dump(commands, f, indent=2)
            
        os.rename(temp_path, queue_path)
        
    except Exception as e:
        print(f"CRITICAL: Failed to write command to queue file {queue_path}: {e}")
        # Log error but do not crash the webhook


# --- Order Processor Functions ---

async def process_shop_order(data: Dict[str, Any]) -> List[str]:
    """Processes a 'Shop Order' and generates item delivery commands."""
    
    ign = parse_player_ign(data)
    if not ign:
        raise ValueError("Could not determine player IGN from payload.")
        
    shop_items = data.get('shop_items', [])
    commands = []
    
    for item in shop_items:
        code = item.get('direct_link_code')
        quantity = item.get('quantity')
        
        delivery_info = ITEM_DELIVERY_MAP.get(code)
        
        if not delivery_info:
            print(f"WARN: Skipping unknown item code: {code}. Item not in ITEM_DELIVERY_MAP.")
            continue 
            
        if quantity is not None:
            commands.append(generate_server_command(
                ign=ign,
                action="item_delivery",
                details={
                    "item_id": delivery_info['item_id'],
                    "quantity": quantity
                }
            ))
            
    return commands


def parse_donation_data(data: Dict[str, Any]) -> Optional[ProcessedDonation]:
    """
    Parses donation/subscription data to determine rank and duration.
    (Contains the complex rank logic)
    """
    try:
        amount = float(data.get('amount', '0.00'))
        product_name_key = data.get('tier_name') or data.get('product_name')
        # Currency check is removed as per instruction. Logic relies solely on price/name.
        
        # 1. Base Rank Key Extraction
        if not product_name_key:
            return None

        if "Patron" in product_name_key:
            base_rank = "Patron"
        elif "Supporter Plus" in product_name_raw:
            base_rank = "Supporter Plus"
        elif "Supporter" in product_name_raw:
            base_rank = "Supporter"
        else:
            print(f"ERROR: Unrecognized base rank in product name: {product_name_raw}")
            return None

        # 2. Strict Lookup using Base Rank and Amount
        lookup_key = (base_rank, amount)
        tier_info = DONATION_MAP.get(lookup_key)

        if not tier_info:
            print(f"ERROR: No tier found for Rank '{base_rank}' and Amount '{amount}'.")
            return None
        
        # 3. Player IGN
        ign_match = parse_player_ign(data)
        
        if not ign_match:
            return None

        # 4. Return Processed Data
        return ProcessedDonation(
            ign=ign_match,
            amount=amount,
            product_name=product_name_raw,
            duration_days=tier_info['days'],
            rank_key=tier_info['rank'],
            is_permanent=tier_info.get('perm', False)
        )

    except Exception as e:
        print(f"CRITICAL ERROR in parse_donation_data: {e}")
        return None

# --- Final Webhook Payload Processor ---

async def process_kofi_webhook_payload(data: Dict[str, Any]):
    """Main function to process any Ko-fi webhook type."""
    
    webhook_type = data.get('type')
    commands = []
    
    if webhook_type == "Shop Order":
        commands = await process_shop_order(data)
    elif webhook_type == "Subscription" or webhook_type == "Donation":
        # New Logic for Rank Grant
        donation = parse_donation_data(data)
        if donation:
            # Grant the rank
            rank_cmd = generate_server_command(
                ign=donation.ign,
                action="rank_grant",
                details={
                    "rank_key": donation.rank_key,
                    "duration_days": donation.duration_days,
                    "is_permanent": donation.is_permanent
                }
            )
            commands.append(rank_cmd)
        else:
            raise ValueError(f"Could not parse rank donation data for processing.")
    else:
        raise ValueError(f"Webhook type '{webhook_type}' not supported for command generation.")

    # Execute all generated commands
    for cmd in commands:
        queue_server_command(cmd)

    return {
        "message": f"Successfully processed {len(commands)} command(s) for {parse_player_ign(data) or 'unknown player'}."
    }
