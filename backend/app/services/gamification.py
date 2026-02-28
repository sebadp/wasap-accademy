from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from supabase import Client

logger = logging.getLogger(__name__)


class GamificationService:
    """Handles XP awards, level calculations, and badge unlocks."""

    XP_REWARDS: dict[str, int] = {
        "lesson_complete": 50,
        "challenge_complete": 200,
        "quiz": 25,
        "streak_3": 50,
        "streak_7": 150,
        "streak_30": 500,
        "first_try": 100,
        "speed_run": 75,
    }

    LEVELS: list[tuple[int, str, int]] = [
        (1, "Novice", 0),
        (2, "Apprentice", 500),
        (3, "Student", 1500),
        (4, "Practitioner", 3500),
        (5, "Builder", 6500),
        (6, "Engineer", 10000),
        (7, "Architect", 15000),
        (8, "Master", 22000),
        (9, "Grandmaster", 32000),
        (10, "Sage", 45000),
    ]

    BADGES: dict[str, dict[str, str]] = {
        "first_boot": {
            "id": "first_boot",
            "name": "First Boot",
            "description": "Complete Module 0",
            "icon": "rocket",
            "condition": "module_complete:module-0",
        },
        "webhook_warrior": {
            "id": "webhook_warrior",
            "name": "Webhook Warrior",
            "description": "Complete Module 1 challenge",
            "icon": "zap",
            "condition": "challenge_complete:module-1",
        },
        "llm_whisperer": {
            "id": "llm_whisperer",
            "name": "LLM Whisperer",
            "description": "Complete Module 2 challenge",
            "icon": "brain",
            "condition": "challenge_complete:module-2",
        },
        "first_blood": {
            "id": "first_blood",
            "name": "First Blood",
            "description": "Complete first challenge",
            "icon": "trophy",
            "condition": "first_challenge",
        },
        "streak_3": {
            "id": "streak_3",
            "name": "On Fire",
            "description": "3-day streak",
            "icon": "flame",
            "condition": "streak:3",
        },
        "streak_7": {
            "id": "streak_7",
            "name": "Unstoppable",
            "description": "7-day streak",
            "icon": "fire",
            "condition": "streak:7",
        },
        "streak_30": {
            "id": "streak_30",
            "name": "Legendary",
            "description": "30-day streak",
            "icon": "star",
            "condition": "streak:30",
        },
        "speed_demon": {
            "id": "speed_demon",
            "name": "Speed Demon",
            "description": "Complete a challenge on first try",
            "icon": "lightning",
            "condition": "first_try_challenge",
        },
    }

    @staticmethod
    def calculate_level(total_xp: int) -> tuple[int, str]:
        """Return (level_number, level_title) for the given XP total."""
        current_level = 1
        current_title = "Novice"
        for level, title, xp_threshold in GamificationService.LEVELS:
            if total_xp >= xp_threshold:
                current_level = level
                current_title = title
            else:
                break
        return current_level, current_title

    @staticmethod
    def xp_to_next_level(total_xp: int) -> int:
        """Return the XP needed to reach the next level."""
        for _level, _title, xp_threshold in GamificationService.LEVELS:
            if xp_threshold > total_xp:
                return xp_threshold - total_xp
        # Already at max level
        return 0

    @staticmethod
    def award_xp(
        supabase: Client,
        user_id: str,
        amount: int,
        source: str,
        source_id: str,
    ) -> tuple[int, int, str]:
        """
        Award XP to a user. Creates an xp_events record and updates
        the user's total XP.

        Returns (new_total_xp, new_level, level_title).
        """
        # Insert XP event
        supabase.table("xp_events").insert(
            {
                "user_id": user_id,
                "amount": amount,
                "source": source,
                "source_id": source_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ).execute()

        # Get current total XP
        result = (
            supabase.table("user_profiles")
            .select("total_xp")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if result.data:
            new_total = result.data["total_xp"] + amount
            supabase.table("user_profiles").update({"total_xp": new_total}).eq(
                "user_id", user_id
            ).execute()
        else:
            new_total = amount
            supabase.table("user_profiles").insert(
                {"user_id": user_id, "total_xp": new_total}
            ).execute()

        new_level, level_title = GamificationService.calculate_level(new_total)
        return new_total, new_level, level_title

    @staticmethod
    def check_badge_unlock(
        supabase: Client,
        user_id: str,
        source: str,
        source_id: str,
    ) -> str | None:
        """
        Check if a badge should be unlocked based on the completed action.
        Returns badge_id if a new badge was unlocked, None otherwise.
        """
        badge_to_award: str | None = None

        for badge_id, badge_info in GamificationService.BADGES.items():
            condition = badge_info["condition"]

            # Check module completion badges
            if condition.startswith("module_complete:"):
                target_module = condition.split(":")[1]
                if source == "lesson_complete" and source_id.startswith(target_module):
                    # Check if the module is fully complete
                    module_result = (
                        supabase.table("module_progress")
                        .select("status")
                        .eq("user_id", user_id)
                        .eq("module_id", target_module)
                        .single()
                        .execute()
                    )
                    if module_result.data and module_result.data["status"] == "completed":
                        badge_to_award = badge_id
                        break

            # Check challenge completion badges
            elif condition.startswith("challenge_complete:"):
                target_module = condition.split(":")[1]
                if source == "challenge_complete" and source_id.startswith(target_module):
                    badge_to_award = badge_id
                    break

            # Check first challenge badge
            elif condition == "first_challenge":
                if source == "challenge_complete":
                    count_result = (
                        supabase.table("xp_events")
                        .select("id", count="exact")
                        .eq("user_id", user_id)
                        .eq("source", "challenge_complete")
                        .execute()
                    )
                    if count_result.count is not None and count_result.count <= 1:
                        badge_to_award = badge_id
                        break

            # Check streak badges
            elif condition.startswith("streak:"):
                target_streak = int(condition.split(":")[1])
                if source == f"streak_{target_streak}":
                    badge_to_award = badge_id
                    break

            # Check first try badge
            elif condition == "first_try_challenge":
                if source == "first_try":
                    badge_to_award = badge_id
                    break

        if badge_to_award is None:
            return None

        # Check if badge already awarded
        existing = (
            supabase.table("user_badges")
            .select("badge_id")
            .eq("user_id", user_id)
            .eq("badge_id", badge_to_award)
            .execute()
        )

        if existing.data:
            return None

        # Award the badge
        supabase.table("user_badges").insert(
            {
                "user_id": user_id,
                "badge_id": badge_to_award,
                "awarded_at": datetime.now(timezone.utc).isoformat(),
            }
        ).execute()

        logger.info("Badge unlocked: %s for user %s", badge_to_award, user_id)
        return badge_to_award
