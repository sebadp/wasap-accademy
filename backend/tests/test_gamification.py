from __future__ import annotations

from app.services.gamification import GamificationService


def test_calculate_level_novice():
    """0 XP should be level 1, Novice."""
    level, title = GamificationService.calculate_level(0)
    assert level == 1
    assert title == "Novice"


def test_calculate_level_apprentice():
    """500 XP should be level 2, Apprentice."""
    level, title = GamificationService.calculate_level(500)
    assert level == 2
    assert title == "Apprentice"


def test_calculate_level_sage():
    """45000 XP should be level 10, Sage."""
    level, title = GamificationService.calculate_level(45000)
    assert level == 10
    assert title == "Sage"


def test_calculate_level_above_sage():
    """XP above 45000 should still be level 10, Sage."""
    level, title = GamificationService.calculate_level(100000)
    assert level == 10
    assert title == "Sage"


def test_calculate_level_between():
    """499 XP should still be level 1, Novice (just under threshold)."""
    level, title = GamificationService.calculate_level(499)
    assert level == 1
    assert title == "Novice"


def test_xp_to_next_level():
    """Test XP needed to reach next level."""
    # At 0 XP, need 500 to reach level 2
    assert GamificationService.xp_to_next_level(0) == 500

    # At 250 XP, need 250 more to reach level 2
    assert GamificationService.xp_to_next_level(250) == 250

    # At 500 XP (level 2), need 1000 more to reach level 3 (1500)
    assert GamificationService.xp_to_next_level(500) == 1000

    # At max level, should return 0
    assert GamificationService.xp_to_next_level(45000) == 0
    assert GamificationService.xp_to_next_level(100000) == 0


def test_xp_rewards_constants():
    """Verify XP reward constants are defined correctly."""
    rewards = GamificationService.XP_REWARDS
    assert rewards["lesson_complete"] == 50
    assert rewards["challenge_complete"] == 200
    assert rewards["quiz"] == 25
    assert rewards["streak_3"] == 50
    assert rewards["streak_7"] == 150
    assert rewards["streak_30"] == 500
    assert rewards["first_try"] == 100
    assert rewards["speed_run"] == 75


def test_badges_defined():
    """Verify all required badges are defined."""
    badges = GamificationService.BADGES
    expected_badges = [
        "first_boot",
        "webhook_warrior",
        "llm_whisperer",
        "first_blood",
        "streak_3",
        "streak_7",
        "streak_30",
        "speed_demon",
    ]
    for badge_id in expected_badges:
        assert badge_id in badges
        assert "name" in badges[badge_id]
        assert "description" in badges[badge_id]
        assert "icon" in badges[badge_id]
        assert "condition" in badges[badge_id]


def test_levels_ordered():
    """Verify levels are ordered by XP threshold."""
    levels = GamificationService.LEVELS
    for i in range(1, len(levels)):
        assert levels[i][2] > levels[i - 1][2], (
            f"Level {levels[i][0]} threshold ({levels[i][2]}) should be greater "
            f"than level {levels[i-1][0]} threshold ({levels[i-1][2]})"
        )
