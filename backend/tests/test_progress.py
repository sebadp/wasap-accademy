from __future__ import annotations

from unittest.mock import MagicMock, patch

from tests.conftest import _TestAuthMiddleware


def _mock_supabase_for_progress(
    lesson_data: list | None = None,
    module_data: list | None = None,
    profile_data: dict | None = None,
):
    """Create a mock supabase that handles progress queries."""
    mock = MagicMock()

    # Mock lesson_progress select
    lesson_result = MagicMock()
    lesson_result.data = lesson_data or []

    # Mock module_progress select
    module_result = MagicMock()
    module_result.data = module_data or []

    # Chain for lesson_progress
    lesson_chain = MagicMock()
    lesson_chain.select.return_value = lesson_chain
    lesson_chain.eq.return_value = lesson_chain
    lesson_chain.execute.return_value = lesson_result

    # Chain for module_progress
    module_chain = MagicMock()
    module_chain.select.return_value = module_chain
    module_chain.eq.return_value = module_chain
    module_chain.execute.return_value = module_result

    # Chain for user_profiles
    profile_result = MagicMock()
    profile_result.data = profile_data or {"total_xp": 0}

    profile_chain = MagicMock()
    profile_chain.select.return_value = profile_chain
    profile_chain.eq.return_value = profile_chain
    profile_chain.single.return_value = profile_chain
    profile_chain.execute.return_value = profile_result

    # Chain for xp_events insert
    xp_chain = MagicMock()
    xp_chain.insert.return_value = xp_chain
    xp_chain.execute.return_value = MagicMock(data=[])

    # Chain for upsert
    upsert_chain = MagicMock()
    upsert_chain.upsert.return_value = upsert_chain
    upsert_chain.execute.return_value = MagicMock(data=[])

    # Chain for update
    update_chain = MagicMock()
    update_chain.update.return_value = update_chain
    update_chain.eq.return_value = update_chain
    update_chain.execute.return_value = MagicMock(data=[])

    def table_router(table_name: str):
        if table_name == "lesson_progress":
            chain = MagicMock()
            chain.select.return_value = lesson_chain
            chain.upsert.return_value = upsert_chain
            return chain
        elif table_name == "module_progress":
            chain = MagicMock()
            chain.select.return_value = module_chain
            chain.upsert.return_value = upsert_chain
            return chain
        elif table_name == "user_profiles":
            chain = MagicMock()
            chain.select.return_value = profile_chain
            chain.update.return_value = update_chain
            chain.insert.return_value = xp_chain
            return chain
        elif table_name == "xp_events":
            return xp_chain
        elif table_name == "user_badges":
            badge_chain = MagicMock()
            badge_result = MagicMock()
            badge_result.data = []
            badge_chain.select.return_value = badge_chain
            badge_chain.eq.return_value = badge_chain
            badge_chain.execute.return_value = badge_result
            badge_chain.insert.return_value = badge_chain
            return badge_chain
        return MagicMock()

    mock.table.side_effect = table_router
    return mock


def test_get_progress_empty(test_client):
    """Test getting progress when user has no progress data."""
    mock_sb = _mock_supabase_for_progress()

    with patch("app.api.progress.get_supabase", return_value=mock_sb):
        response = test_client.get("/api/progress/")

    assert response.status_code == 200
    data = response.json()
    assert "lessons" in data
    assert "modules" in data
    assert data["lessons"] == []
    assert data["modules"] == []


def test_complete_lesson(test_client):
    """Test completing a lesson."""
    mock_sb = _mock_supabase_for_progress(
        profile_data={"total_xp": 100},
    )

    with patch("app.api.progress.get_supabase", return_value=mock_sb):
        response = test_client.post(
            "/api/progress/",
            json={
                "module_id": "module-0",
                "lesson_id": "lesson-0-1",
                "time_spent_seconds": 300,
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert "xp_awarded" in data
    assert "new_total_xp" in data
    assert "new_level" in data
    assert data["xp_awarded"] == 50  # lesson_complete XP


def test_complete_lesson_awards_xp(test_client):
    """Test that completing a lesson awards the correct XP amount."""
    mock_sb = _mock_supabase_for_progress(
        profile_data={"total_xp": 450},
    )

    with patch("app.api.progress.get_supabase", return_value=mock_sb):
        response = test_client.post(
            "/api/progress/",
            json={
                "module_id": "module-0",
                "lesson_id": "lesson-0-2",
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert data["xp_awarded"] == 50
    # 450 + 50 = 500, which should be level 2 (Apprentice)
    assert data["new_total_xp"] == 500
    assert data["new_level"] == 2
