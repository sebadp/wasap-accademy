from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.dependencies import get_current_user_id, get_supabase
from app.models import XPEvent, XPResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/api/xp", tags=["xp"])


@router.get("/", response_model=XPResponse)
async def get_xp(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """Return user's XP summary and recent events."""
    supabase = get_supabase()

    # Get total XP
    profile_result = (
        supabase.table("user_profiles")
        .select("total_xp")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    total_xp = profile_result.data["total_xp"] if profile_result.data else 0
    current_level, level_title = GamificationService.calculate_level(total_xp)
    xp_to_next = GamificationService.xp_to_next_level(total_xp)

    # Get recent XP events (last 20)
    events_result = (
        supabase.table("xp_events")
        .select("amount, source, source_id, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )

    recent_events = [
        XPEvent(
            amount=event["amount"],
            source=event["source"],
            source_id=event["source_id"],
            created_at=event["created_at"],
        )
        for event in (events_result.data or [])
    ]

    return XPResponse(
        total_xp=total_xp,
        current_level=current_level,
        level_title=level_title,
        xp_to_next_level=xp_to_next,
        recent_events=recent_events,
    )
