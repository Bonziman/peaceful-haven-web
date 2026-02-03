# backend/app/routers/webhooks.py (FINAL ROBUST WEBHOOK HANDLER)

# ... imports ...
from fastapi import APIRouter, Request, HTTPException
from typing import Dict, Any
import json
import urllib.parse # Used for decoding form data
from ..config import get_settings
from ..services.automation import process_kofi_webhook_payload

router = APIRouter()
settings = get_settings()

@router.post("/kofi", status_code=200, summary="Ko-fi Webhook Handler (Donations/Shop)")
async def handle_kofi_webhook(request: Request):
    """
    Receives and validates the Ko-fi webhook, handling different Content-Types.
    """
    content_type = request.headers.get('content-type', '').split(';')[0].strip()
    raw_body = None
    
    # 1. READ RAW BODY BASED ON CONTENT-TYPE
    if content_type == 'application/json':
        try:
            raw_body = await request.json()
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format in request body.")
            
    elif content_type == 'application/x-www-form-urlencoded':
        # This is the most common Ko-fi format: the payload is inside the 'data' key
        try:
            # Read the body as text
            form_data = await request.body()
            # Parse the form data (key=value&key2=value2)
            parsed_data = urllib.parse.parse_qs(form_data.decode())
            
            # The Ko-fi payload is typically a JSON string inside the 'data' parameter
            data_string = parsed_data.get(b'data') or parsed_data.get('data') 
            
            if not data_string:
                raise ValueError("Ko-fi payload missing 'data' field.")
                
            # Decode the URL-encoded JSON string and load it
            data_string = data_string[0] if isinstance(data_string, list) else data_string
            raw_body = json.loads(data_string)
            
        except (ValueError, json.JSONDecodeError) as e:
            print(f"ERROR processing Ko-fi form data: {e}")
            raise HTTPException(status_code=400, detail="Could not parse Ko-fi form data 'data' field.")
            
    else:
        raise HTTPException(status_code=415, detail=f"Unsupported Content-Type: {content_type}")

    # 2. VERIFICATION CHECK
    verification_token = raw_body.get('verification_token')
    
    if verification_token != settings.KOFI_VERIFICATION_TOKEN:
        print(f"SECURITY ALERT: Invalid Ko-fi token received: {verification_token}")
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid verification token.")

    try:
        # 3. PROCESS DONATION
        result = await process_kofi_webhook_payload(raw_body)
        
        print(f"SUCCESS: Received Ko-fi {raw_body.get('type')} from {raw_body.get('from_name')}")
        
        return {"status": "success", "message": result["message"]}
    
    except Exception as e:
        # *** FIX: Print the full traceback before returning a 500 ***
        import traceback
        print("="*60)
        print("CRITICAL WEBHOOK PROCESSING ERROR")
        print(f"PAYLOAD TYPE: {raw_body.get('type')}")
        print(f"ERROR: {e}")
        print(traceback.format_exc())
        print("="*60)
        
        raise HTTPException(status_code=500, detail=f"Internal server error during processing: {e}")
