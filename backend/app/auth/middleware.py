from __future__ import annotations

import logging

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse

from app.config import get_settings
from app.database.supabase_client import create_supabase_client

logger = logging.getLogger(__name__)

SKIP_AUTH_PATHS = {"/", "/health", "/docs", "/openapi.json", "/redoc", "/favicon.ico"}


class AuthMiddleware(BaseHTTPMiddleware):
    """Validates JWT tokens from the Authorization header using Supabase."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Skip auth for certain paths
        if request.url.path in SKIP_AUTH_PATHS:
            return await call_next(request)

        # Extract Bearer token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing or invalid Authorization header"},
            )

        token = auth_header.removeprefix("Bearer ").strip()
        if not token:
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing token"},
            )

        try:
            settings = get_settings()
            supabase = create_supabase_client(
                settings.supabase_url, settings.supabase_anon_key
            )
            user_response = supabase.auth.get_user(token)
            user = user_response.user

            if user is None:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid token"},
                )

            request.state.user_id = user.id

        except Exception as exc:
            logger.warning("Auth failed: %s", exc)
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"},
            )

        return await call_next(request)
