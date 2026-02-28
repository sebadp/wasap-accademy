from __future__ import annotations

from unittest.mock import MagicMock, patch

from app.config import Settings
from app.services.tutor import TutorService


def _make_mock_supabase(questions_count: int = 0, total_xp: int = 1000):
    """Create a mock supabase for tutor tests."""
    mock = MagicMock()

    # Mock tutor_questions count
    count_result = MagicMock()
    count_result.count = questions_count
    count_result.data = []

    # Mock user_profiles for XP
    profile_result = MagicMock()
    profile_result.data = {"total_xp": total_xp}

    # Mock insert chain
    insert_chain = MagicMock()
    insert_chain.insert.return_value = insert_chain
    insert_chain.execute.return_value = MagicMock(data=[])

    # XP events insert chain
    xp_insert_chain = MagicMock()
    xp_insert_chain.insert.return_value = xp_insert_chain
    xp_insert_chain.execute.return_value = MagicMock(data=[])

    # Profile chain for update
    profile_update_chain = MagicMock()
    profile_update_chain.update.return_value = profile_update_chain
    profile_update_chain.eq.return_value = profile_update_chain
    profile_update_chain.execute.return_value = MagicMock(data=[])

    # Profile chain for select
    profile_select_chain = MagicMock()
    profile_select_chain.select.return_value = profile_select_chain
    profile_select_chain.eq.return_value = profile_select_chain
    profile_select_chain.single.return_value = profile_select_chain
    profile_select_chain.execute.return_value = profile_result

    def table_router(table_name: str):
        if table_name == "tutor_questions":
            chain = MagicMock()
            select_chain = MagicMock()
            select_chain.select.return_value = select_chain
            select_chain.eq.return_value = select_chain
            select_chain.execute.return_value = count_result
            chain.select.return_value = select_chain
            chain.insert.return_value = insert_chain
            return chain
        elif table_name == "xp_events":
            return xp_insert_chain
        elif table_name == "user_profiles":
            chain = MagicMock()
            chain.select.return_value = profile_select_chain
            chain.update.return_value = profile_update_chain
            return chain
        return MagicMock()

    mock.table.side_effect = table_router
    return mock


def _make_settings() -> Settings:
    return Settings(
        supabase_url="http://localhost:54321",
        supabase_anon_key="test-key",
        supabase_service_role_key="test-service-key",
        anthropic_api_key="test-anthropic-key",
        tutor_provider="claude",
    )


@patch.object(TutorService, "_call_claude", return_value="Here is a hint.")
def test_free_questions_limit(mock_claude):
    """Test that first 3 questions are free."""
    mock_sb = _make_mock_supabase(questions_count=0)
    settings = _make_settings()

    answer, xp_cost, free_remaining = TutorService.ask(
        mock_sb, "test-user", "challenge-0", "How do I start?", "module-0", settings
    )

    assert answer == "Here is a hint."
    assert xp_cost == 0
    assert free_remaining == 2  # 3 free - 0 asked = 3, then -1 after asking = 2


@patch.object(TutorService, "_call_claude", return_value="Another hint.")
def test_xp_cost_after_free(mock_claude):
    """Test that questions beyond the free limit cost XP."""
    mock_sb = _make_mock_supabase(questions_count=3)
    settings = _make_settings()

    answer, xp_cost, free_remaining = TutorService.ask(
        mock_sb, "test-user", "challenge-0", "More help please?", "module-0", settings
    )

    assert answer == "Another hint."
    assert xp_cost == TutorService.QUESTION_XP_COST
    assert free_remaining == 0


@patch.object(TutorService, "_call_claude", return_value="Keep going!")
def test_free_questions_boundary(mock_claude):
    """Test at exactly the boundary (2 questions asked, 1 free remaining)."""
    mock_sb = _make_mock_supabase(questions_count=2)
    settings = _make_settings()

    answer, xp_cost, free_remaining = TutorService.ask(
        mock_sb, "test-user", "challenge-0", "Almost there?", "module-0", settings
    )

    assert answer == "Keep going!"
    assert xp_cost == 0
    assert free_remaining == 0  # Was 1 free, used it, now 0
