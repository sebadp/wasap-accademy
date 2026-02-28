from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel


# --- Progress ---


class UserProgress(BaseModel):
    module_id: str
    lesson_id: str
    status: str
    time_spent_seconds: int = 0


class LessonProgressResponse(BaseModel):
    module_id: str
    lesson_id: str
    status: str
    completed_at: datetime | None = None


class ModuleProgressResponse(BaseModel):
    module_id: str
    status: str
    challenge_completed: bool = False
    lessons: list[LessonProgressResponse] = []


class CompleteItemRequest(BaseModel):
    module_id: str
    lesson_id: str | None = None
    time_spent_seconds: int | None = None


class CompleteItemResponse(BaseModel):
    xp_awarded: int
    new_total_xp: int
    new_level: int
    badge_unlocked: str | None = None


# --- XP ---


class XPEvent(BaseModel):
    amount: int
    source: str
    source_id: str
    created_at: datetime


class XPResponse(BaseModel):
    total_xp: int
    current_level: int
    level_title: str
    xp_to_next_level: int
    recent_events: list[XPEvent] = []


# --- Badges ---


class BadgeResponse(BaseModel):
    badge_id: str
    name: str
    description: str
    icon: str
    awarded_at: datetime | None = None


# --- Streaks ---


class StreakDay(BaseModel):
    date: date
    xp_earned: int


class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: date | None = None
    freeze_tokens: int = 0
    calendar: list[StreakDay] = []


# --- Challenges ---


class ChallengeDefinition(BaseModel):
    challenge_id: str
    module_id: str
    title: str
    description: str
    starter_code: str
    test_code: str
    xp_reward: int


class ChallengeSubmitRequest(BaseModel):
    challenge_id: str
    code: str
    tests_passed: int
    tests_total: int
    passed: bool


class ChallengeSubmitResponse(BaseModel):
    xp_awarded: int
    new_total_xp: int
    badge_unlocked: str | None = None


# --- Tutor ---


class TutorRequest(BaseModel):
    challenge_id: str
    question: str
    module_id: str


class TutorResponse(BaseModel):
    answer: str
    xp_cost: int
    free_questions_remaining: int


# --- Leaderboard ---


class LeaderboardEntry(BaseModel):
    username: str
    display_name: str
    avatar_url: str | None = None
    total_xp: int
    current_level: int
