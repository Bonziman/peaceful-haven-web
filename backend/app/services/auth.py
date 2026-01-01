# backend/app/services/auth.py
import httpx
import json
from typing import Dict, Any, Optional
from ..config import get_settings

settings = get_settings()

MS_TOKEN_URL = "https://login.live.com/oauth20_token.srf"
XBOX_AUTH_URL = "https://user.auth.xboxlive.com/user/authenticate"
XBOX_XSTS_URL = "https://xsts.auth.xboxlive.com/xsts/authorize"
MOJANG_PROFILE_URL = "https://api.minecraftservices.com/minecraft/profile"
MOJANG_LOGIN_URL = "https://api.minecraftservices.com/authentication/login_with_xbox"

class AuthException(Exception):
    """Custom exception for authentication errors."""
    pass

async def trade_code_for_token(code: str) -> Dict[str, Any]:
    """Trades the Authorization Code for an Access Token and a Refresh Token."""
    data = {
        "client_id": settings.MICROSOFT_CLIENT_ID,
        "client_secret": settings.MICROSOFT_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": settings.MICROSOFT_REDIRECT_URI,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(MS_TOKEN_URL, data=data)
        
        if response.status_code != 200:
            print(f"Token Exchange Failed: {response.text}")
            raise AuthException("Failed to exchange code for token.")
        
        return response.json()

async def get_xbox_token(access_token: str) -> Dict[str, Any]:
    """Uses the Microsoft Access Token to get an Xbox Live token (XBL token)."""
    
    rps_ticket = f"d={access_token}"

    data = {
        "Properties": {
            "AuthMethod": "RPS",
            "SiteName": "user.auth.xboxlive.com",
            "RpsTicket": rps_ticket,
        },
        "RelyingParty": "http://auth.xboxlive.com",
        "TokenType": "JWT"
    }
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(XBOX_AUTH_URL, headers=headers, content=json.dumps(data))
        
        if response.status_code != 200:
            print(f"XBL Auth Failed: {response.text}")
            raise AuthException("Failed to get Xbox Live token.")
            
        return response.json()

async def get_xsts_token(xbl_token_data: Dict[str, Any]) -> Dict[str, Any]:
    """Uses the XBL token to get the XSTS token (required for Minecraft API access)."""
    xbl_token = xbl_token_data['Token']
    user_hash = xbl_token_data['DisplayClaims']['xui'][0]['uhs']
    
    data = {
        "Properties": {
            "SandboxId": "RETAIL",
            "UserTokens": [xbl_token]
        },
        "RelyingParty": "rp://api.minecraftservices.com/", # The Minecraft API audience
        "TokenType": "JWT"
    }
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(XBOX_XSTS_URL, headers=headers, content=json.dumps(data))

        if response.status_code != 200:
            print(f"XSTS Auth Failed: {response.text}")
            # A common error here is 401/403: "User not an owner of Minecraft" (requires purchase)
            raise AuthException("Failed XSTS authorization. User may not own Minecraft.")
        
        return response.json()

async def get_minecraft_uuid(mojang_access_token: str) -> str:
    """Uses the Mojang Access Token to get the Minecraft profile (UUID)."""
    
    # Use the standard Bearer token header format
    headers = {"Authorization": f"Bearer {mojang_access_token}"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(MOJANG_PROFILE_URL, headers=headers)
        
        if response.status_code != 200:
            print(f"Minecraft Profile Failed: {response.text}")
            raise AuthException("Failed to get Minecraft profile (UUID).")
            
        profile = response.json()
        # The 'id' field is the Minecraft UUID
        if not profile.get('id'):
            # This is a critical check for users who own the account but haven't set up the profile
             raise AuthException("Minecraft profile exists, but no UUID found. Does the user own a Java profile?")
            
        return profile.get('id')


async def get_mojang_access_token(xsts_token_data: Dict[str, Any]) -> str:
    """Trades the XSTS token for the final Mojang/Minecraft Access Token."""
    
    xsts_token = xsts_token_data['Token']
    # The XSTS token needs to be formatted with the User Hash (uhs)
    user_hash = xsts_token_data['DisplayClaims']['xui'][0]['uhs']
    
    data = {
        "identityToken": f"XBL3.0 x={user_hash};{xsts_token}"
    }
    headers = {"Content-Type": "application/json"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(MOJANG_LOGIN_URL, headers=headers, content=json.dumps(data))
        
        if response.status_code != 200:
            print(f"Mojang Token Exchange Failed: {response.text}")
            raise AuthException("Failed to get Mojang Access Token. User may not own Minecraft.")
        
        return response.json()['access_token']
