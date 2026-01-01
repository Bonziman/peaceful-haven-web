# backend/app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends, Request
from starlette.responses import RedirectResponse
from ..config import get_settings
from ..services.auth import (
    trade_code_for_token, 
    get_xbox_token,
    get_xsts_token, 
    get_minecraft_uuid,
    get_mojang_access_token,
    AuthException
)
from ..services.security import create_access_token, set_auth_cookie 
from ..services.player_status import check_player_status

router = APIRouter()
settings = get_settings()



# The Microsoft Authorization endpoint URL
MS_AUTH_URL = "https://login.live.com/oauth20_authorize.srf"

@router.get("/login", summary="Initiates the Microsoft login process")
async def microsoft_login():
    """
    Redirects the user to the Microsoft login page to request authorization.
    """
    params = {
        "client_id": settings.MICROSOFT_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.MICROSOFT_REDIRECT_URI,
        "scope": "XboxLive.signin offline_access User.Read", # pls work, i fucking beg you
        "state": "some_random_secure_string", 
    }
    
    # Construct the full URL for the redirect
    import urllib.parse
    query_string = urllib.parse.urlencode(params)
    full_url = f"{MS_AUTH_URL}?{query_string}"
    
    return RedirectResponse(full_url)

@router.get("/callback", summary="Handles the redirect from Microsoft after login")
async def microsoft_callback(request: Request, code: str = None, state: str = None, error: str = None):
    """
    Completes the OAuth flow, validates player, issues JWT, and sets auth cookie.
    """
    if error:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=auth_failed", status_code=302)
    if not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=no_code", status_code=302)
        
    # TODO: Implement state validation for CSRF protection
    
    try:
        ms_tokens = await trade_code_for_token(code)
        xbl_token_data = await get_xbox_token(ms_tokens['access_token'])
        xsts_token_data = await get_xsts_token(xbl_token_data)
        
        # 4. NEW STEP: Trade XSTS for Mojang Access Token
        mojang_access_token = await get_mojang_access_token(xsts_token_data)
        
        # 5. Get Minecraft UUID (using the new Mojang token)
        minecraft_uuid = await get_minecraft_uuid(mojang_access_token)
        
        # 5. Player Status Checks
        is_banned, has_logged_in = await check_player_status(minecraft_uuid)
        
        if is_banned:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=banned", status_code=302)
        
        if not has_logged_in:
            # We require the player to have logged in once to the MC server
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=not_logged_in", status_code=302)

        # 6. Success: Create JWT and set cookie
        jwt_token = create_access_token(data={"sub": minecraft_uuid})
        
        # Redirect back to the frontend's main page
        response = RedirectResponse(url=settings.FRONTEND_URL, status_code=302)
        set_auth_cookie(response, jwt_token)
        
        return response
        
    except AuthException as e:
        # Log this exception on the server side
        print(f"Authentication API Chain Failed: {e}") 
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=api_fail", status_code=302)
    except Exception as e:
        print(f"Unhandled Auth Error: {e}")
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=server_error", status_code=302)
