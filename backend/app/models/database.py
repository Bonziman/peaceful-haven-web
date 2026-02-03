"""
Database models for all data sources.
Save as: backend/app/models/database.py
"""
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Text, SmallInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

# ============================================
# Website Database (Read/Write)
# ============================================

class User(Base):
    """Main user table for website authentication"""
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    minecraft_uuid = Column(String(36), unique=True, nullable=False, index=True)
    minecraft_username = Column(String(16), nullable=False)
    microsoft_id = Column(String(255), unique=True, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Session(Base):
    """User session tokens"""
    __tablename__ = "sessions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    token = Column(String(255), unique=True, nullable=False, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    last_activity = Column(DateTime, default=datetime.utcnow)
    
    ip_address = Column(String(45))
    user_agent = Column(Text)
    
    user = relationship("User", back_populates="sessions")


class UserPreference(Base):
    """User preferences and settings"""
    __tablename__ = "user_preferences"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    
    theme = Column(String(20), default="dark")
    items_per_page = Column(Integer, default=20)
    
    email = Column(String(255))
    notify_trades = Column(Boolean, default=False)
    
    profile_public = Column(Boolean, default=True)
    show_playtime = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="preferences")


# ============================================
# JetsAntiAFKPro Database (Read-Only)
# ============================================

class PlayerPlaytime(Base):
    """Maps to JetsAntiAFKPro data.db"""
    __tablename__ = "player_afk_data"
    __bind_key__ = "playtime"
    
    uuid = Column(String(32), primary_key=True)  # Without dashes
    playtime = Column(Integer, nullable=False)  # In ticks (20 ticks = 1 second)
    
    @property
    def playtime_hours(self):
        """Convert ticks to hours"""
        return self.playtime / 72000  # 72000 ticks = 1 hour
    
    @property
    def playtime_formatted(self):
        """Return formatted playtime string"""
        total_seconds = self.playtime / 20
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        return f"{hours}h {minutes}m"


# ============================================
# Shopkeepers Trade Logs Database (Read-Only)
# ============================================

class ShopkeeperTrade(Base):
    """Maps to Shopkeepers trade-logs/trades.db"""
    __tablename__ = "trade"
    __bind_key__ = "shopkeepers"
    
    # Using rowid as primary key since the table doesn't define one
    rowid = Column(Integer, primary_key=True, autoincrement=True)
    
    timestamp = Column(String(30), nullable=False, index=True)
    
    # Buyer info
    player_uuid = Column(String(36), nullable=False, index=True)
    player_name = Column(String(16), nullable=False)
    
    # Shop info
    shop_uuid = Column(String(36), nullable=False, index=True)
    shop_type = Column(String(32), nullable=False)
    shop_world = Column(String(32))
    shop_x = Column(Integer, nullable=False)
    shop_y = Column(Integer, nullable=False)
    shop_z = Column(Integer, nullable=False)
    
    # Shop owner info
    shop_owner_uuid = Column(String(36), index=True)
    shop_owner_name = Column(String(16))
    
    # Item 1 (first cost item)
    item_1_type = Column(String(64), nullable=False)
    item_1_amount = Column(SmallInteger, nullable=False)
    item_1_metadata = Column(Text, nullable=False)
    
    # Item 2 (second cost item, optional)
    item_2_type = Column(String(64))
    item_2_amount = Column(SmallInteger)
    item_2_metadata = Column(Text)
    
    # Result item
    result_item_type = Column(String(64), nullable=False)
    result_item_amount = Column(SmallInteger, nullable=False)
    result_item_metadata = Column(Text, nullable=False)
    
    # Trade count (how many times this trade was executed)
    trade_count = Column(SmallInteger, nullable=False)
