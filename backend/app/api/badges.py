from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.dependencies import get_current_user_id, get_supabase
from app.models import BadgeResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/api/badges", tags=["badges"])


@router.get("/", response_model=list[BadgeResponse])
async def get_badges(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """Return all badges awarded to the current user."""
    supabase = get_supabase()

    # Get user's awarded badges
    result = (
        supabase.table("user_badges")
        .select("badge_id, awarded_at")
        .eq("user_id", user_id)
        .execute()
    )

    badges = []
    for row in result.data or []:
        badge_id = row["badge_id"]
        badge_def = GamificationService.BADGES.get(badge_id)
        if badge_def:
            badges.append(
                BadgeResponse(
                    badge_id=badge_id,
                    name=badge_def["name"],
                    description=badge_def["description"],
                    icon=badge_def["icon"],
                    awarded_at=row["awarded_at"],
                )
            )

    return badges
