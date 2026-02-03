"""Players router - Player profiles and stats"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_playtime_db, get_shopkeepers_db
from ..models.database import PlayerPlaytime, ShopkeeperTrade
from ..services.yaml_parser import get_shops_by_owner
from ..schemas.player import PlayerPlaytimeInfo, PlayerProfile
from ..services.player_status import is_player_banned_by_uuid, has_player_logged_in, get_player_name_by_uuid

router = APIRouter()

@router.get("/{player_uuid}")
async def get_player_profile(
    player_uuid: str,
    playtime_db: Session = Depends(get_playtime_db),
    trades_db: Session = Depends(get_shopkeepers_db)
):
    """Get complete player profile with stats"""
    
    # Get playtime (UUID without dashes in database)
    uuid_no_dashes = player_uuid.replace("-", "")
    playtime_record = playtime_db.query(PlayerPlaytime)\
        .filter(PlayerPlaytime.uuid == uuid_no_dashes)\
        .first()
    
    if not playtime_record:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Get player name from trades database
    trade_with_name = trades_db.query(ShopkeeperTrade)\
        .filter(
            (ShopkeeperTrade.player_uuid == player_uuid) |
            (ShopkeeperTrade.shop_owner_uuid == player_uuid)
        )\
        .first()
    
    username = trade_with_name.player_name if trade_with_name else "Unknown"
    
    # Get shop count
    shops = get_shops_by_owner(player_uuid)
    
    # Get basic trade stats
    total_sales = trades_db.query(func.count(ShopkeeperTrade.rowid))\
        .filter(ShopkeeperTrade.shop_owner_uuid == player_uuid)\
        .scalar() or 0
    
    total_purchases = trades_db.query(func.count(ShopkeeperTrade.rowid))\
        .filter(ShopkeeperTrade.player_uuid == player_uuid)\
        .scalar() or 0
    
    return {
        "uuid": player_uuid,
        "username": username,
        "playtime": {
            "uuid": player_uuid,
            "username": username,
            "playtime_ticks": playtime_record.playtime,
            "playtime_hours": playtime_record.playtime_hours,
            "playtime_formatted": playtime_record.playtime_formatted
        },
        "total_shops": len(shops),
        "trade_stats": {
            "total_sales": total_sales,
            "total_purchases": total_purchases
        }
    }

@router.get("/playtime/top")
async def get_top_playtime(
    limit: int = 10,
    db: Session = Depends(get_playtime_db)
):
    """Get players with most playtime"""
    players = db.query(PlayerPlaytime)\
        .order_by(PlayerPlaytime.playtime.desc())\
        .limit(limit)\
        .all()
    
    return [
        {
            "uuid": p.uuid,
            "playtime_ticks": p.playtime,
            "playtime_hours": p.playtime_hours,
            "playtime_formatted": p.playtime_formatted
        }
        for p in players
    ]

@router.get("/{player_uuid}/status")
async def get_player_status(player_uuid: str):
    """Get the login and ban status for a player by UUID."""
    
    player_name = get_player_name_by_uuid(player_uuid)
    logged_in = has_player_logged_in(player_uuid)
    
    # Check if a UUID is present in the database (e.g., playtime or trade logs) for a more definitive 'logged in' check
    # For now, we rely on usercache.json.
    
    if not logged_in:
        return {
            "uuid": player_uuid,
            "name": None,
            "has_logged_in": False,
            "is_banned": False, # Cannot be banned if never logged in (though IP ban is possible)
            "message": "Player has not logged in to the server yet or cache has expired."
        }
        
    is_banned = is_player_banned_by_uuid,(player_uuid)

    return {
        "uuid": player_uuid,
        "name": player_name,
        "has_logged_in": True,
        "is_banned": is_banned,
        "message": "Player status retrieved successfully."
    }
