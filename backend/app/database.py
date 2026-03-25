"""Supabase client helpers — anon key client + per-request authenticated client."""

from typing import Optional

from fastapi import Depends, Request
from supabase import create_client, Client

from app.config import get_settings, Settings

_anon_client: Optional[Client] = None


def _get_anon_client(settings: Settings) -> Client:
    """Lazily create a shared anon-key client (read-only / unauthenticated ops)."""
    global _anon_client
    if _anon_client is None:
        _anon_client = create_client(settings.supabase_url, settings.supabase_anon_key)
    return _anon_client


def get_supabase(settings: Settings = Depends(get_settings)) -> Client:
    """Return the shared anon client (no user context — RLS blocks user rows)."""
    return _get_anon_client(settings)


def get_supabase_for_user(request: Request, settings: Settings = Depends(get_settings)) -> Client:
    """Create a per-request client that forwards the user's JWT to Supabase.

    PostgREST sees the JWT, sets ``auth.uid()`` inside Postgres, and RLS
    policies allow access to only that user's rows.
    """
    token: Optional[str] = None
    auth_header = request.headers.get("authorization", "")
    if auth_header.lower().startswith("bearer "):
        token = auth_header[7:]

    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    if token:
        client.postgrest.auth(token)
    return client
