"""
HavenStay / Aradads Home - Supabase Python Client
Integrates Python FastAPI backend with Supabase PostgreSQL & Supabase Storage.
Provides graceful local fallback if credentials are not yet configured.
"""

import os
from typing import Optional, Dict, Any, List

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

_supabase_client = None

def get_supabase_client():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not SUPABASE_URL or not SUPABASE_KEY:
        return None

    try:
        from supabase import create_client, Client
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return _supabase_client
    except Exception as e:
        print(f"[Supabase] Could not initialize client: {e}")
        return None

def is_supabase_enabled() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY)
