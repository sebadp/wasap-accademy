from __future__ import annotations

import logging

import anthropic
import httpx
from supabase import Client

from app.config import Settings
from app.services.gamification import GamificationService

logger = logging.getLogger(__name__)


# Module context for building prompts
MODULE_CONTEXT: dict[str, str] = {
    "module-0": "This module covers setting up a WhatsApp chatbot development environment.",
    "module-1": "This module covers WhatsApp webhook integration and message handling.",
    "module-2": "This module covers connecting LLMs (Claude/Ollama) to WhatsApp bots.",
    "module-3": "This module covers conversation memory and context management.",
    "module-4": "This module covers tool use and function calling with AI agents.",
    "module-5": "This module covers deploying and monitoring production AI agents.",
}


class TutorService:
    """AI tutor that answers student questions about challenges."""

    FREE_QUESTIONS_PER_CHALLENGE = 3
    QUESTION_XP_COST = 25

    @staticmethod
    def ask(
        supabase: Client,
        user_id: str,
        challenge_id: str,
        question: str,
        module_id: str,
        settings: Settings,
    ) -> tuple[str, int, int]:
        """
        Handle a tutor question.

        Returns (answer, xp_cost, free_questions_remaining).
        """
        # Count previous questions for this challenge
        result = (
            supabase.table("tutor_questions")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .eq("challenge_id", challenge_id)
            .execute()
        )

        questions_asked = result.count if result.count is not None else 0
        free_remaining = max(0, TutorService.FREE_QUESTIONS_PER_CHALLENGE - questions_asked)

        # Determine XP cost
        xp_cost = 0
        if free_remaining <= 0:
            xp_cost = TutorService.QUESTION_XP_COST
            # Deduct XP (negative award)
            GamificationService.award_xp(
                supabase, user_id, -xp_cost, "tutor_question", challenge_id
            )

        # Build the prompt
        context = MODULE_CONTEXT.get(module_id, "")
        system_prompt = (
            "You are a helpful programming tutor for AgentCraft, an academy that teaches "
            "students how to build WhatsApp AI agents. "
            "You guide students through challenges without giving away full solutions. "
            "Give hints, explain concepts, and help debug issues. "
            f"Current module context: {context}"
        )

        user_prompt = (
            f"Challenge: {challenge_id}\n"
            f"Student question: {question}"
        )

        # Call the appropriate AI provider
        if settings.tutor_provider == "claude":
            answer = TutorService._call_claude(settings, system_prompt, user_prompt)
        else:
            answer = TutorService._call_ollama(settings, system_prompt, user_prompt)

        # Record the question
        supabase.table("tutor_questions").insert(
            {
                "user_id": user_id,
                "challenge_id": challenge_id,
                "question": question,
                "answer": answer,
                "xp_cost": xp_cost,
            }
        ).execute()

        # Recalculate free remaining (after recording)
        if free_remaining > 0:
            free_remaining -= 1

        return answer, xp_cost, free_remaining

    @staticmethod
    def _call_claude(settings: Settings, system_prompt: str, user_prompt: str) -> str:
        """Call Anthropic Claude API."""
        try:
            client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return response.content[0].text
        except Exception as exc:
            logger.error("Claude API error: %s", exc)
            return "I'm having trouble connecting to the AI service. Please try again shortly."

    @staticmethod
    def _call_ollama(settings: Settings, system_prompt: str, user_prompt: str) -> str:
        """Call local Ollama API."""
        try:
            response = httpx.post(
                f"{settings.ollama_base_url}/api/chat",
                json={
                    "model": "llama3.2",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "stream": False,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("message", {}).get("content", "No response from model.")
        except Exception as exc:
            logger.error("Ollama API error: %s", exc)
            return "I'm having trouble connecting to the local AI service. Please try again."
