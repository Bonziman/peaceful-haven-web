from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API
    API_BASE_URL: str = "https://api.peacefulhaven.lol"
    FRONTEND_URL: str = "https://peacefulhaven.lol"
    
    # Minecraft Paths
    MINECRAFT_DIR: str
    SHOPKEEPERS_SAVE: str = "/minecraft/shopkeepers/data/save.yml"
    SHOPKEEPERS_DB: str
    PLAYTIME_DB: str
    STOCK_FILE_PATH: str = "/minecraft/automation/shop_stock.json" 
    COMMAND_QUEUE_PATH: str = "/minecraft/automation/command_queue.json" # Already pointing here
    MINECRAFT_STATS_DIR: str = "/minecraft/mcstats"
    
    # Ko-fi Webhook
    KOFI_VERIFICATION_TOKEN: str
    
    
    
    # Minecraft Server (for status queries)
    MC_SERVER_HOST: str = "localhost"
    MC_SERVER_PORT: int = 25565
    
    # Database
    DATABASE_URL: str
    
    # Microsoft OAuth
    MICROSOFT_CLIENT_ID: str
    MICROSOFT_CLIENT_SECRET: str
    MICROSOFT_REDIRECT_URI: str
    
    #Account Verification
    BANNED_PLAYERS_JSON: str = "/minecraft/banned-players.json"     
    BANNED_IPS_JSON: str = "/minecraft/banned-ips.json"             
    USERCACHE_JSON: str = "/minecraft/usercache.json"
    
    # Security
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    
    # Environment
    ENVIRONMENT: str = "production"
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields in .env

@lru_cache()
def get_settings():
    return Settings()
