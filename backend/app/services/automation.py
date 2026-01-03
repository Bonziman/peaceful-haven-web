# backend/app/services/automation.py (FINAL LOGIC FOR RANKS)

# --- NEW CONSTANTS FOR RANK GRANTS ---
# Define the exact products and prices you will create in your Ko-fi Shop
# Key: (Base Rank, Price) -> Value: {rank, days, perm}
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
    
    # Patron Tiers (Only Patron gets Permanent)
    ("Patron (1 Month)", 20.00):  {"rank": "patron", "days": 30},
    ("Patron (3 Months)", 50.00):  {"rank": "patron", "days": 90},
    ("Patron (6 Months)", 90.00):  {"rank": "patron", "days": 180},
    ("Patron (Permanent)", 160.00): {"rank": "patron", "days": 9999, "perm": True}, # Permanent
}
# --- END NEW CONSTANTS ---


# ... parse_donation_data function (modified to support subscription data) ...
def parse_donation_data(data: Dict[str, Any]) -> Optional[ProcessedDonation]:
    """
    Parses donation/subscription data to determine rank and duration.
    """
    try:
        amount = float(data.get('amount', '0.00'))
        product_name_raw = data.get('tier_name') or data.get('product_name')
        message = data.get('message', '')

        # 1. Base Rank Key Extraction
        if not product_name_raw:
            print(f"ERROR: Product/Tier name is missing. Cannot determine rank.")
            return None

        if "Patron" in product_name_raw:
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
            print(f"ERROR: Could not determine player IGN from payload.")
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


# --- Final Webhook Payload Processor (Modified for Rank Grants) ---

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
