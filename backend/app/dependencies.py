from __future__ import annotations

from fastapi import Request

from app.config import get_settings
from app.database.supabase_client import create_supabase_client


def get_supabase():
    """Return a Supabase client using the anon key."""
    settings = get_settings()
    return create_supabase_client(settings.supabase_url, settings.supabase_anon_key)


def get_current_user_id(request: Request) -> str:
    """Extract user_id from request state (set by auth middleware)."""
    user_id: str = request.state.user_id
    return user_id
