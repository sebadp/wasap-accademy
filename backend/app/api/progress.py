from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.dependencies import get_current_user_id, get_supabase
from app.models import CompleteItemRequest, CompleteItemResponse
from app.services.progress import ProgressService

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("/")
async def get_progress(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """Return all lesson and module progress for the current user."""
    supabase = get_supabase()
    progress = ProgressService.get_user_progress(supabase, user_id)
    return progress


@router.post("/", response_model=CompleteItemResponse)
async def complete_item(
    body: CompleteItemRequest,
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """
    Mark a lesson or module as completed and award XP.

    If lesson_id is provided, upserts lesson_progress.
    Always checks if the parent module should be updated.
    """
    supabase = get_supabase()

    if body.lesson_id:
        result = ProgressService.complete_lesson(
            supabase,
            user_id,
            body.module_id,
            body.lesson_id,
            body.time_spent_seconds,
        )
    else:
        # Module-level completion (e.g. marking module as done directly)
        status = ProgressService.update_module_status(supabase, user_id, body.module_id)
        result = {
            "xp_awarded": 0,
            "new_total_xp": 0,
            "new_level": 1,
            "badge_unlocked": None,
        }

    return CompleteItemResponse(
        xp_awarded=result["xp_awarded"],
        new_total_xp=result["new_total_xp"],
        new_level=result["new_level"],
        badge_unlocked=result.get("badge_unlocked"),
    )
