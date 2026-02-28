from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.dependencies import get_current_user_id, get_supabase
from app.models import LeaderboardEntry
from app.services.gamification import GamificationService

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("/", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """Return top 20 users by XP (placeholder for Fase 2)."""
    supabase = get_supabase()

    result = (
        supabase.table("user_profiles")
        .select("user_id, username, display_name, avatar_url, total_xp")
        .order("total_xp", desc=True)
        .limit(20)
        .execute()
    )

    entries = []
    for row in result.data or []:
        total_xp = row.get("total_xp", 0)
        level, _title = GamificationService.calculate_level(total_xp)
        entries.append(
            LeaderboardEntry(
                username=row.get("username", ""),
                display_name=row.get("display_name", ""),
                avatar_url=row.get("avatar_url"),
                total_xp=total_xp,
                current_level=level,
            )
        )

    return entries
