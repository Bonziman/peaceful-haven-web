"""Shops router - View shopkeeper data"""
from fastapi import APIRouter, HTTPException
from typing import List
from ..services.yaml_parser import load_shops, get_shop_by_uuid, get_shops_by_owner

router = APIRouter()

@router.get("/")
async def list_shops(skip: int = 0, limit: int = 100):
    """Get all shops with pagination"""
    shops = load_shops()
    total = len(shops)
    return {
        "shops": shops[skip:skip+limit],
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "page_size": limit
    }

@router.get("/{shop_uuid}")
async def get_shop(shop_uuid: str):
    """Get a specific shop by UUID"""
    shop = get_shop_by_uuid(shop_uuid)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop

@router.get("/owner/{owner_uuid}")
async def get_owner_shops(owner_uuid: str):
    """Get all shops owned by a player"""
    shops = get_shops_by_owner(owner_uuid)
    return {"shops": shops, "total": len(shops)}
