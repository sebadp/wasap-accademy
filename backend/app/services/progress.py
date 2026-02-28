from __future__ import annotations

import logging
from datetime import datetime, timezone

from supabase import Client

from app.services.gamification import GamificationService

logger = logging.getLogger(__name__)


class ProgressService:
    """Handles lesson and module progress tracking."""

    # Module prerequisites: module_id -> list of required module_ids
    MODULE_PREREQUISITES: dict[str, list[str]] = {
        "module-0": [],
        "module-1": ["module-0"],
        "module-2": ["module-1"],
        "module-3": ["module-2"],
        "module-4": ["module-3"],
        "module-5": ["module-4"],
    }

    # Lessons per module (for determining module completion)
    MODULE_LESSONS: dict[str, list[str]] = {
        "module-0": ["lesson-0-1", "lesson-0-2", "lesson-0-3"],
        "module-1": ["lesson-1-1", "lesson-1-2", "lesson-1-3", "lesson-1-4"],
        "module-2": ["lesson-2-1", "lesson-2-2", "lesson-2-3", "lesson-2-4"],
        "module-3": ["lesson-3-1", "lesson-3-2", "lesson-3-3"],
        "module-4": ["lesson-4-1", "lesson-4-2", "lesson-4-3"],
        "module-5": ["lesson-5-1", "lesson-5-2", "lesson-5-3"],
    }

    @staticmethod
    def get_user_progress(supabase: Client, user_id: str) -> dict:
        """Get all progress data for a user."""
        # Fetch lesson progress
        lesson_result = (
            supabase.table("lesson_progress")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        # Fetch module progress
        module_result = (
            supabase.table("module_progress")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        return {
            "lessons": lesson_result.data or [],
            "modules": module_result.data or [],
        }

    @staticmethod
    def complete_lesson(
        supabase: Client,
        user_id: str,
        module_id: str,
        lesson_id: str,
        time_spent: int | None = None,
    ) -> dict:
        """
        Mark a lesson as completed and award XP.
        Returns dict with xp_awarded, new_total_xp, new_level, badge_unlocked.
        """
        now = datetime.now(timezone.utc).isoformat()

        # Upsert lesson progress
        supabase.table("lesson_progress").upsert(
            {
                "user_id": user_id,
                "module_id": module_id,
                "lesson_id": lesson_id,
                "status": "completed",
                "completed_at": now,
                "time_spent_seconds": time_spent or 0,
            },
            on_conflict="user_id,lesson_id",
        ).execute()

        # Award XP for lesson completion
        xp_amount = GamificationService.XP_REWARDS["lesson_complete"]
        new_total, new_level, level_title = GamificationService.award_xp(
            supabase, user_id, xp_amount, "lesson_complete", lesson_id
        )

        # Update module status
        module_status = ProgressService.update_module_status(supabase, user_id, module_id)

        # Check for badge unlocks
        badge_unlocked = GamificationService.check_badge_unlock(
            supabase, user_id, "lesson_complete", lesson_id
        )

        return {
            "xp_awarded": xp_amount,
            "new_total_xp": new_total,
            "new_level": new_level,
            "level_title": level_title,
            "badge_unlocked": badge_unlocked,
            "module_status": module_status,
        }

    @staticmethod
    def update_module_status(supabase: Client, user_id: str, module_id: str) -> str:
        """
        Check if all lessons in a module are completed and update module status.
        Returns the current module status.
        """
        required_lessons = ProgressService.MODULE_LESSONS.get(module_id, [])

        if not required_lessons:
            return "unknown"

        # Get completed lessons for this module
        result = (
            supabase.table("lesson_progress")
            .select("lesson_id")
            .eq("user_id", user_id)
            .eq("module_id", module_id)
            .eq("status", "completed")
            .execute()
        )

        completed_ids = {row["lesson_id"] for row in (result.data or [])}
        all_done = all(lid in completed_ids for lid in required_lessons)

        status = "completed" if all_done else "in_progress"

        # Upsert module progress
        supabase.table("module_progress").upsert(
            {
                "user_id": user_id,
                "module_id": module_id,
                "status": status,
                "challenge_completed": False,
            },
            on_conflict="user_id,module_id",
        ).execute()

        return status

    @staticmethod
    def check_module_unlock(supabase: Client, user_id: str, module_id: str) -> bool:
        """Check if a module's prerequisites are met."""
        prerequisites = ProgressService.MODULE_PREREQUISITES.get(module_id, [])

        if not prerequisites:
            return True

        # Check that all prerequisite modules are completed
        result = (
            supabase.table("module_progress")
            .select("module_id, status")
            .eq("user_id", user_id)
            .in_("module_id", prerequisites)
            .execute()
        )

        completed_modules = {
            row["module_id"]
            for row in (result.data or [])
            if row["status"] == "completed"
        }

        return all(prereq in completed_modules for prereq in prerequisites)
