"""Supabase client singleton (service-role key, server-side only)."""

from typing import Optional

from fastapi import Depends
from supabase import create_client, Client

from app.config import get_settings, Settings

_client: Optional[Client] = None


def get_supabase(settings: Settings = Depends(get_settings)) -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _client
