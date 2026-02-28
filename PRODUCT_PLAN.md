# PRODUCT_PLAN.md — AgentCraft

## Vision

**AgentCraft** is a gamified learning platform that teaches Generative AI by building a real production project — WasAP, a WhatsApp AI assistant with 85 Python files, 15 skills, 316 tests, and full memory/RAG/tool-calling/agents/tracing/guardrails systems.

Students don't learn from toy examples. They learn by understanding, modifying, and extending production-grade code.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                     │
│  MDX Lessons · Skill Tree · Monaco Editor · Pyodide Runner  │
│  Supabase Auth · Gamification UI                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────────┐
│                    BACKEND (FastAPI)                          │
│  /api/progress · /api/xp · /api/badges · /api/streaks       │
│  /api/tutor · /api/challenges · /api/leaderboard             │
│  Supabase client · Claude/Ollama tutor · Business logic      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                      │
│  Auth · Profiles · Progress · XP · Badges · Streaks · Tutor │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 + TypeScript | App Router, SSR, MDX |
| Styling | Tailwind CSS + shadcn/ui | Utility-first + component library |
| Content | MDX + custom components | Rich interactive lessons |
| Auth | Supabase Auth | Email/password + OAuth |
| Database | Supabase (PostgreSQL) | Data + RLS policies |
| Backend | FastAPI + Python | API, gamification logic, tutor |
| Challenges | Pyodide (Python WASM) | Browser-native Python execution |
| AI Tutor | Claude API / Ollama | Context-aware help |
| Deploy | Vercel + Python host | Frontend + backend separately |

## Development Phases

### Paso 0: Scaffolding + Documentation Framework — DONE
- [x] Directory structure
- [x] CLAUDE.md, AGENTS.md, PRODUCT_PLAN.md
- [x] docs/ templates (exec-plans, features, testing)
- [x] .env.example, docker-compose.yml

### Fase 1A: Backend + Frontend Foundation — DONE
- [x] Backend: pyproject.toml, main.py, config, auth middleware
- [x] Backend: API routes (progress, xp, badges, streaks)
- [x] Backend: Services (gamification, progress, tutor)
- [x] Backend: Tests (15 test cases)
- [x] Frontend: Next.js 16 init, Supabase auth (client/server/middleware)
- [x] Frontend: API client, Navbar, Sidebar, protected academy layout
- [x] Frontend: Landing page, Skill Tree (/map), auth pages (login/signup/callback)
- [x] Frontend: TypeScript types, design system (dark theme)
- [x] Supabase: Migrations 001-004 (profiles, progress, gamification, tutor)

### Fase 1B: MDX Content + Components — DONE
- [x] 9 MDX components (Callout, Terminal, Step, FileTree, Highlight, Concept, Quiz, ProgressBar, MDXComponents)
- [x] Content loader (gray-matter + reading-time, server-side)
- [x] Module 0 (5 lessons), Module 1 (5 lessons), Module 2 (5 lessons) — 15 lecciones MDX
- [x] Module list page, module detail page, lesson page with MDX rendering
- [x] LessonSidebar, LessonNav, CompleteButton
- [x] Syntax highlighting via @shikijs/rehype (server-side, zero JS bundle)

### Fase 1C: Challenges + Gamification + Tutor — IN PROGRESS
- [ ] Pyodide Web Worker runner (Python WASM in browser)
- [ ] CodeEditor (Monaco, dynamic import) + SplitPane layout
- [ ] Challenge page (/challenges/[challengeId]) con test runner
- [ ] XPBar (en academy layout), LevelUpModal
- [ ] BadgeGrid, StreakCalendar
- [ ] AI Tutor chat component (frontend) conectado al backend
- [ ] Profile page (/profile) con stats, badges, streak
- [ ] Hooks: useXP, useStreak, useBadges
- [ ] Build + lint + smoke test E2E

### Fase 2: Advanced Content (future)
- [ ] Modules 3-16
- [ ] Leaderboard
- [ ] Social features
- [ ] Advanced challenges

## Curriculum — 17 Modules

| # | Module | WasAP Source | Tier |
|---|--------|-------------|------|
| 0 | Setup & Onboarding | Project root, docker | Foundation |
| 1 | Webhook Pipeline | `app/webhook/` | Foundation |
| 2 | LLM Integration | `app/llm/`, `app/whatsapp/` | Foundation |
| 3 | Database & State | `app/database/` | Core |
| 4 | Conversation Memory | `app/memory/` | Core |
| 5 | Skills Framework | `app/skills/registry.py` | Core |
| 6 | Tool Calling | `app/llm/client.py` tools | Core |
| 7 | RAG Pipeline | `app/rag/` | Advanced |
| 8 | Guardrails | `app/guardrails/` | Advanced |
| 9 | Tracing & Observability | `app/tracing/` | Advanced |
| 10 | Multi-Agent Patterns | `app/agents/` | Advanced |
| 11 | Media Processing | `app/media/` | Specialist |
| 12 | Scheduling | `app/skills/scheduling/` | Specialist |
| 13 | Web Search | `app/skills/web_search/` | Specialist |
| 14 | Performance Tuning | Various | Specialist |
| 15 | Testing Mastery | `tests/` | Specialist |
| 16 | Production Deploy | Docker, CI/CD | Capstone |

## Gamification System

### XP Rewards
| Action | XP |
|--------|-----|
| Complete lesson | 50 |
| Complete challenge | 200 |
| Quiz correct | 25 |
| 3-day streak | 50 |
| 7-day streak | 150 |
| 30-day streak | 500 |
| First try challenge pass | 100 |
| Speed run bonus | 75 |

### Levels
| Level | Title | XP Required |
|-------|-------|------------|
| 1 | Novice | 0 |
| 2 | Apprentice | 500 |
| 3 | Student | 1,500 |
| 4 | Practitioner | 3,500 |
| 5 | Builder | 6,500 |
| 6 | Engineer | 10,000 |
| 7 | Architect | 15,000 |
| 8 | Master | 22,000 |
| 9 | Grandmaster | 32,000 |
| 10 | Sage | 45,000 |

### AI Tutor
- 3 free questions per challenge
- Additional questions cost 25 XP each
- Context-aware: knows which module/lesson the student is on
