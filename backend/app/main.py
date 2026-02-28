from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import badges, challenges, leaderboard, progress, streaks, tutor, xp
from app.auth.middleware import AuthMiddleware
from app.config import get_settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    logger.info("AgentCraft API started")
    yield
    logger.info("AgentCraft API shutting down")


app = FastAPI(
    title="AgentCraft API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth middleware
app.add_middleware(AuthMiddleware)

# Include routers
app.include_router(progress.router)
app.include_router(xp.router)
app.include_router(badges.router)
app.include_router(streaks.router)
app.include_router(challenges.router)
app.include_router(tutor.router)
app.include_router(leaderboard.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {"name": "AgentCraft API", "version": "0.1.0"}
