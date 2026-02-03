"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import init_website_db
from .config import get_settings
from .routers import shops, trades, players, server, auth, stats, webhooks
from .services.item_mapping import load_item_map_cache 

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    print("🚀 Starting Peaceful Haven API...")
    init_website_db()
    
    # Load item map during startup
    await load_item_map_cache() 
    
    print("✓ All systems ready!")
    yield
    print("👋 Shutting down...")

app = FastAPI(
    title="Peaceful Haven API",
    description="Minecraft Server Web Interface",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,                  # Should be 'https://web.peacefulhaven.lol'
        "http://localhost:5173",
        "http://localhost:3000",
        "https://web.peacefulhaven.lol",        # <-- Redundancy is safety here
        "https://api.peacefulhaven.lol",
        "http://127.0.0.1:8000"                 # Added for good measure
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoints
@app.get("/")
async def root():
    return {
        "message": "Peaceful Haven API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "shops": "/shops",
            "trades": "/trades",
            "players": "/players",
            "server": "/server"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Include routers
app.include_router(shops.router, prefix="/shops", tags=["Shops"])
app.include_router(trades.router, prefix="/trades", tags=["Trades"])
app.include_router(players.router, prefix="/players", tags=["Players"])
app.include_router(server.router, prefix="/server", tags=["Server"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(stats.router, prefix="/stats", tags=["Statistics"])
app.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
