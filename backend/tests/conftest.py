from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from fastapi import Request
from fastapi.testclient import TestClient
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

from app.config import Settings
from app.main import app


@pytest.fixture
def settings() -> Settings:
    """Return test Settings with dummy values."""
    return Settings(
        supabase_url="http://localhost:54321",
        supabase_anon_key="test-anon-key",
        supabase_service_role_key="test-service-key",
        anthropic_api_key="test-anthropic-key",
        debug=True,
    )


@pytest.fixture
def mock_supabase() -> MagicMock:
    """Return a MagicMock Supabase client."""
    return MagicMock()


class _TestAuthMiddleware(BaseHTTPMiddleware):
    """Test middleware that bypasses auth and sets a test user ID."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request.state.user_id = "test-user-id"
        return await call_next(request)


@pytest.fixture
def test_client() -> TestClient:
    """
    Return a FastAPI TestClient with auth middleware replaced
    by a test middleware that injects a fixed user_id.
    """
    # Replace the middleware stack: remove AuthMiddleware and add test one
    # We rebuild the app middleware stack for testing
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware

    from app.api import badges, challenges, leaderboard, progress, streaks, tutor, xp

    test_app = FastAPI(title="AgentCraft API Test")

    test_app.add_middleware(_TestAuthMiddleware)

    test_app.include_router(progress.router)
    test_app.include_router(xp.router)
    test_app.include_router(badges.router)
    test_app.include_router(streaks.router)
    test_app.include_router(challenges.router)
    test_app.include_router(tutor.router)
    test_app.include_router(leaderboard.router)

    @test_app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    @test_app.get("/")
    async def root():
        return {"name": "AgentCraft API", "version": "0.1.0"}

    return TestClient(test_app)
