"""Trades router - View trade history and analytics"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from ..database import get_shopkeepers_db
from ..models.database import ShopkeeperTrade
from ..schemas.trade import TradeRecord, TradeStats, PlayerTradeHistory, TopSeller
from ..services.yaml_parser import extract_all_available_trades 
from ..services.item_mapping import enrich_item_data 

router = APIRouter()

@router.get("/recent", response_model=List[TradeRecord])
async def get_recent_trades(
    limit: int = 50,
    db: Session = Depends(get_shopkeepers_db)
):
    """Get recent trades across all shops"""
    trades = db.query(ShopkeeperTrade)\
        .order_by(desc(ShopkeeperTrade.timestamp))\
        .limit(limit)\
        .all()
    return trades

@router.get("/player/{player_uuid}")
async def get_player_trades(
    player_uuid: str,
    as_buyer: bool = True,
    as_seller: bool = True,
    limit: int = 100,
    db: Session = Depends(get_shopkeepers_db)
):
    """Get trades for a specific player (as buyer or seller)"""
    trades = []
    
    if as_buyer:
        buyer_trades = db.query(ShopkeeperTrade)\
            .filter(ShopkeeperTrade.player_uuid == player_uuid)\
            .order_by(desc(ShopkeeperTrade.timestamp))\
            .limit(limit)\
            .all()
        trades.extend(buyer_trades)
    
    if as_seller:
        seller_trades = db.query(ShopkeeperTrade)\
            .filter(ShopkeeperTrade.shop_owner_uuid == player_uuid)\
            .order_by(desc(ShopkeeperTrade.timestamp))\
            .limit(limit)\
            .all()
        trades.extend(seller_trades)
    
    # Sort combined results by timestamp
    trades.sort(key=lambda x: x.timestamp, reverse=True)
    
    return {
        "player_uuid": player_uuid,
        "trades": trades[:limit],
        "total": len(trades)
    }

@router.get("/stats/{player_uuid}")
async def get_player_trade_stats(
    player_uuid: str,
    db: Session = Depends(get_shopkeepers_db)
):
    """Get trade statistics for a player"""
    
    # Sales (player is shop owner)
    sales = db.query(ShopkeeperTrade)\
        .filter(ShopkeeperTrade.shop_owner_uuid == player_uuid)\
        .all()
    
    # Purchases (player is buyer)
    purchases = db.query(ShopkeeperTrade)\
        .filter(ShopkeeperTrade.player_uuid == player_uuid)\
        .all()
    
    # Calculate total items sold
    total_items_sold = sum(trade.result_item_amount * trade.trade_count for trade in sales)
    
    # Calculate total items bought
    total_items_bought = sum(trade.result_item_amount * trade.trade_count for trade in purchases)
    
    # Find most sold item
    item_counts = {}
    for trade in sales:
        item = trade.result_item_type
        count = trade.result_item_amount * trade.trade_count
        item_counts[item] = item_counts.get(item, 0) + count
    
    most_sold_item = None
    most_sold_count = 0
    if item_counts:
        most_sold_item = max(item_counts, key=item_counts.get)
        most_sold_count = item_counts[most_sold_item]
    
    # Unique customers
    unique_customers = db.query(func.count(func.distinct(ShopkeeperTrade.player_uuid)))\
        .filter(ShopkeeperTrade.shop_owner_uuid == player_uuid)\
        .scalar() or 0
    
    return {
        "total_trades": len(sales) + len(purchases),
        "total_items_sold": total_items_sold,
        "total_items_bought": total_items_bought,
        "most_sold_item": most_sold_item,
        "most_sold_count": most_sold_count,
        "unique_customers": unique_customers
    }

@router.get("/leaderboard/sellers")
async def get_top_sellers(
    limit: int = 10,
    db: Session = Depends(get_shopkeepers_db)
):
    """Get top sellers by total sales"""
    
    # Group by shop owner and count total sales
    top_sellers = db.query(
        ShopkeeperTrade.shop_owner_uuid,
        ShopkeeperTrade.shop_owner_name,
        func.count(ShopkeeperTrade.rowid).label('total_sales'),
        func.count(func.distinct(ShopkeeperTrade.result_item_type)).label('unique_items')
    )\
    .filter(ShopkeeperTrade.shop_owner_uuid.isnot(None))\
    .group_by(ShopkeeperTrade.shop_owner_uuid, ShopkeeperTrade.shop_owner_name)\
    .order_by(desc('total_sales'))\
    .limit(limit)\
    .all()
    
    return [
        {
            "player_uuid": seller[0],
            "player_name": seller[1],
            "total_sales": seller[2],
            "unique_items": seller[3]
        }
        for seller in top_sellers
    ]

@router.get("/shop/{shop_uuid}")
async def get_shop_trades(
    shop_uuid: str,
    limit: int = 100,
    db: Session = Depends(get_shopkeepers_db)
):
    """Get all trades for a specific shop"""
    trades = db.query(ShopkeeperTrade)\
        .filter(ShopkeeperTrade.shop_uuid == shop_uuid)\
        .order_by(desc(ShopkeeperTrade.timestamp))\
        .limit(limit)\
        .all()
    
    return {
        "shop_uuid": shop_uuid,
        "trades": trades,
        "total": len(trades)
    }

@router.get("/available", summary="Get all currently available trades from active shops")
async def get_available_trades(skip: int = 0, limit: int = 100):
    all_trades = extract_all_available_trades()
    total = len(all_trades)
    
    # 1. Enrich the trade data asynchronously
    for trade in all_trades:
        # Enrich the result item
        trade['result'] = await enrich_item_data(trade.get('result'))
        # Enrich the cost 1 item
        trade['cost1'] = await enrich_item_data(trade.get('cost1'))
        # Enrich the cost 2 item (if it exists)
        trade['cost2'] = await enrich_item_data(trade.get('cost2'))
        
    # 2. Return the paginated, enriched trades
    return {
        "trades": all_trades[skip:skip+limit],
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "page_size": limit
    }
