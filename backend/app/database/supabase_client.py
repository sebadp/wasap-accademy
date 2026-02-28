from __future__ import annotations

from supabase import Client, create_client

from app.config import get_settings


def create_supabase_client(url: str, key: str) -> Client:
    """Create and return a Supabase client."""
    return create_client(url, key)


def get_service_client() -> Client:
    """Return a Supabase client using the service role key (for admin operations)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
