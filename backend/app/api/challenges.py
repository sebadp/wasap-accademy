from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from app.dependencies import get_current_user_id, get_supabase
from app.models import (
    ChallengeDefinition,
    ChallengeSubmitRequest,
    ChallengeSubmitResponse,
)
from app.services.gamification import GamificationService

router = APIRouter(prefix="/api/challenges", tags=["challenges"])

# Hardcoded challenge definitions (can be moved to JSON files later)
CHALLENGES: dict[str, ChallengeDefinition] = {
    "challenge-0": ChallengeDefinition(
        challenge_id="challenge-0",
        module_id="module-0",
        title="Hello Bot",
        description=(
            "Create a simple function that returns a greeting message. "
            "The function should accept a name parameter and return "
            "'Hello, {name}! Welcome to AgentCraft.'"
        ),
        starter_code=(
            'def greet(name: str) -> str:\n'
            '    """Return a greeting message."""\n'
            '    # Your code here\n'
            '    pass\n'
        ),
        test_code=(
            'def test_greet():\n'
            '    assert greet("World") == "Hello, World! Welcome to AgentCraft."\n'
            '    assert greet("Alice") == "Hello, Alice! Welcome to AgentCraft."\n'
        ),
        xp_reward=200,
    ),
    "challenge-1": ChallengeDefinition(
        challenge_id="challenge-1",
        module_id="module-1",
        title="Webhook Handler",
        description=(
            "Implement a webhook verification function that validates "
            "incoming WhatsApp webhook requests by checking the verify token "
            "and returning the hub.challenge value."
        ),
        starter_code=(
            'def verify_webhook(mode: str, token: str, challenge: str, '
            'verify_token: str) -> str | None:\n'
            '    """Verify a WhatsApp webhook subscription request."""\n'
            '    # Your code here\n'
            '    pass\n'
        ),
        test_code=(
            'def test_verify_webhook():\n'
            '    assert verify_webhook("subscribe", "my-token", "challenge-123", '
            '"my-token") == "challenge-123"\n'
            '    assert verify_webhook("subscribe", "wrong", "challenge-123", '
            '"my-token") is None\n'
            '    assert verify_webhook("unsubscribe", "my-token", "challenge-123", '
            '"my-token") is None\n'
        ),
        xp_reward=200,
    ),
    "challenge-2": ChallengeDefinition(
        challenge_id="challenge-2",
        module_id="module-2",
        title="LLM Message Builder",
        description=(
            "Create a function that builds a properly formatted message list "
            "for an LLM API call, including a system prompt and user message."
        ),
        starter_code=(
            'def build_messages(system_prompt: str, user_message: str) -> '
            'list[dict[str, str]]:\n'
            '    """Build a message list for an LLM API call."""\n'
            '    # Your code here\n'
            '    pass\n'
        ),
        test_code=(
            'def test_build_messages():\n'
            '    result = build_messages("You are helpful.", "Hello")\n'
            '    assert len(result) == 2\n'
            '    assert result[0] == {"role": "system", "content": "You are helpful."}\n'
            '    assert result[1] == {"role": "user", "content": "Hello"}\n'
        ),
        xp_reward=200,
    ),
}


@router.get("/{challenge_id}", response_model=ChallengeDefinition)
async def get_challenge(challenge_id: str):
    """Return a challenge definition by ID."""
    challenge = CHALLENGES.get(challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


@router.post("/submit", response_model=ChallengeSubmitResponse)
async def submit_challenge(
    body: ChallengeSubmitRequest,
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    """
    Record a challenge submission.
    If passed, awards XP and checks for badge unlocks.
    """
    supabase = get_supabase()
    challenge = CHALLENGES.get(body.challenge_id)

    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    xp_awarded = 0
    badge_unlocked: str | None = None

    if body.passed:
        # Check if already submitted successfully
        existing = (
            supabase.table("challenge_submissions")
            .select("id")
            .eq("user_id", user_id)
            .eq("challenge_id", body.challenge_id)
            .eq("passed", True)
            .execute()
        )

        is_first_submission = not existing.data

        # Record submission
        supabase.table("challenge_submissions").insert(
            {
                "user_id": user_id,
                "challenge_id": body.challenge_id,
                "code": body.code,
                "tests_passed": body.tests_passed,
                "tests_total": body.tests_total,
                "passed": body.passed,
            }
        ).execute()

        if is_first_submission:
            # Award challenge XP
            xp_awarded = challenge.xp_reward
            new_total, new_level, level_title = GamificationService.award_xp(
                supabase,
                user_id,
                xp_awarded,
                "challenge_complete",
                body.challenge_id,
            )

            # Check for first_blood badge
            badge_unlocked = GamificationService.check_badge_unlock(
                supabase, user_id, "challenge_complete", body.challenge_id
            )

            # Check for first_try bonus (no previous failed attempts)
            failed_attempts = (
                supabase.table("challenge_submissions")
                .select("id", count="exact")
                .eq("user_id", user_id)
                .eq("challenge_id", body.challenge_id)
                .eq("passed", False)
                .execute()
            )

            if (failed_attempts.count is not None and failed_attempts.count == 0):
                first_try_xp = GamificationService.XP_REWARDS["first_try"]
                xp_awarded += first_try_xp
                new_total, new_level, level_title = GamificationService.award_xp(
                    supabase, user_id, first_try_xp, "first_try", body.challenge_id
                )
                first_try_badge = GamificationService.check_badge_unlock(
                    supabase, user_id, "first_try", body.challenge_id
                )
                if first_try_badge:
                    badge_unlocked = first_try_badge
        else:
            # Already completed, record submission but no XP
            supabase_result = (
                supabase.table("user_profiles")
                .select("total_xp")
                .eq("user_id", user_id)
                .single()
                .execute()
            )
            new_total = supabase_result.data["total_xp"] if supabase_result.data else 0
    else:
        # Failed submission - record it
        supabase.table("challenge_submissions").insert(
            {
                "user_id": user_id,
                "challenge_id": body.challenge_id,
                "code": body.code,
                "tests_passed": body.tests_passed,
                "tests_total": body.tests_total,
                "passed": False,
            }
        ).execute()

        profile = (
            supabase.table("user_profiles")
            .select("total_xp")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        new_total = profile.data["total_xp"] if profile.data else 0

    return ChallengeSubmitResponse(
        xp_awarded=xp_awarded,
        new_total_xp=new_total,
        badge_unlocked=badge_unlocked,
    )
