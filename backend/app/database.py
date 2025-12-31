"""
Database configuration with multiple database support.
Handles: Website DB, Shopkeepers DB, Playtime DB
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from contextlib import contextmanager
from .config import get_settings

settings = get_settings()

# ============================================
# Website Database (SQLite - Read/Write)
# ============================================
website_engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=settings.ENVIRONMENT == "development"
)

WebsiteSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=website_engine)

# ============================================
# Shopkeepers Database (SQLite - Read Only)
# ============================================
shopkeepers_engine = create_engine(
    f"sqlite:///{settings.SHOPKEEPERS_DB}",
    connect_args={"check_same_thread": False, "uri": True},
    poolclass=StaticPool
)

ShopkeepersSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=shopkeepers_engine)

# ============================================
# Playtime Database (SQLite - Read Only)
# ============================================
playtime_engine = create_engine(
    f"sqlite:///{settings.PLAYTIME_DB}",
    connect_args={"check_same_thread": False, "uri": True},
    poolclass=StaticPool
)

PlaytimeSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=playtime_engine)

# ============================================
# Dependency Functions
# ============================================

def get_website_db():
    """Dependency for website database"""
    db = WebsiteSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_shopkeepers_db():
    """Dependency for shopkeepers database"""
    db = ShopkeepersSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_playtime_db():
    """Dependency for playtime database"""
    db = PlaytimeSessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================
# Initialize Website Database
# ============================================

def init_website_db():
    """Create all tables in website database"""
    from .models.database import Base
    Base.metadata.create_all(bind=website_engine)
    print("✓ Website database initialized")

# ============================================
# Context Managers (for services)
# ============================================

@contextmanager
def get_website_session():
    """Context manager for website db in services"""
    db = WebsiteSessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

@contextmanager
def get_shopkeepers_session():
    """Context manager for shopkeepers db in services"""
    db = ShopkeepersSessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_playtime_session():
    """Context manager for playtime db in services"""
    db = PlaytimeSessionLocal()
    try:
        yield db
    finally:
        db.close()
