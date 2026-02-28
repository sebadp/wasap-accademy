from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.config import get_settings
from app.dependencies import get_current_user_id, get_supabase
from app.models import TutorRequest, TutorResponse
from app.services.tutor import TutorService

router = APIRouter(prefix="/api/tutor", tags=["tutor"])


@router.post("/", response_model=TutorResponse)
async def ask_tutor(
    body: TutorRequest,
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """
    Handle a tutor question.

    Checks free questions (3 per challenge), charges XP if over limit.
    Calls the tutor service and returns the answer.
    """
    supabase = get_supabase()
    settings = get_settings()

    answer, xp_cost, free_remaining = TutorService.ask(
        supabase,
        user_id,
        body.challenge_id,
        body.question,
        body.module_id,
        settings,
    )

    return TutorResponse(
        answer=answer,
        xp_cost=xp_cost,
        free_questions_remaining=free_remaining,
    )
