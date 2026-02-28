from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request

from app.dependencies import get_current_user_id, get_supabase
from app.models import StreakDay, StreakResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/api/streaks", tags=["streaks"])


@router.get("/", response_model=StreakResponse)
async def get_streaks(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """Return current streak info and last 30 days calendar."""
    supabase = get_supabase()

    # Get streak data
    streak_result = (
        supabase.table("user_streaks")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    streak_data = streak_result.data
    if not streak_data:
        return StreakResponse(
            current_streak=0,
            longest_streak=0,
            last_activity_date=None,
            freeze_tokens=0,
            calendar=[],
        )

    # Get last 30 days of activity
    thirty_days_ago = (date.today() - timedelta(days=30)).isoformat()
    calendar_result = (
        supabase.table("daily_activity")
        .select("date, xp_earned")
        .eq("user_id", user_id)
        .gte("date", thirty_days_ago)
        .order("date", desc=True)
        .execute()
    )

    calendar = [
        StreakDay(date=row["date"], xp_earned=row["xp_earned"])
        for row in (calendar_result.data or [])
    ]

    return StreakResponse(
        current_streak=streak_data.get("current_streak", 0),
        longest_streak=streak_data.get("longest_streak", 0),
        last_activity_date=streak_data.get("last_activity_date"),
        freeze_tokens=streak_data.get("freeze_tokens", 0),
        calendar=calendar,
    )


@router.post("/", response_model=StreakResponse)
async def record_activity(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """
    Record daily activity and update streak counters.

    Checks if last_activity_date was yesterday (continue streak),
    today (no change), or earlier (reset streak).
    Awards streak bonuses at 3/7/30 days.
    """
    supabase = get_supabase()
    today = date.today()
    yesterday = today - timedelta(days=1)

    # Get or create streak record
    streak_result = (
        supabase.table("user_streaks")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    streak_data = streak_result.data

    if not streak_data:
        # First activity ever
        supabase.table("user_streaks").insert(
            {
                "user_id": user_id,
                "current_streak": 1,
                "longest_streak": 1,
                "last_activity_date": today.isoformat(),
                "freeze_tokens": 0,
            }
        ).execute()
        current_streak = 1
        longest_streak = 1
    else:
        last_activity = streak_data.get("last_activity_date")
        current_streak = streak_data.get("current_streak", 0)
        longest_streak = streak_data.get("longest_streak", 0)

        if last_activity:
            last_date = date.fromisoformat(str(last_activity))

            if last_date == today:
                # Already recorded today, return current state
                pass
            elif last_date == yesterday:
                # Continue the streak
                current_streak += 1
            else:
                # Streak broken, reset
                current_streak = 1
        else:
            current_streak = 1

        longest_streak = max(longest_streak, current_streak)

        supabase.table("user_streaks").update(
            {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "last_activity_date": today.isoformat(),
            }
        ).eq("user_id", user_id).execute()

    # Award streak bonuses
    streak_bonuses = {3: "streak_3", 7: "streak_7", 30: "streak_30"}
    if current_streak in streak_bonuses:
        bonus_key = streak_bonuses[current_streak]
        xp_amount = GamificationService.XP_REWARDS[bonus_key]
        GamificationService.award_xp(
            supabase, user_id, xp_amount, bonus_key, f"streak-{current_streak}"
        )
        # Check for streak badge
        GamificationService.check_badge_unlock(
            supabase, user_id, bonus_key, f"streak-{current_streak}"
        )

    # Upsert daily activity record
    supabase.table("daily_activity").upsert(
        {
            "user_id": user_id,
            "date": today.isoformat(),
            "xp_earned": 0,  # Will be updated by XP events
        },
        on_conflict="user_id,date",
    ).execute()

    # Return updated streak info
    return await get_streaks(request, user_id)
