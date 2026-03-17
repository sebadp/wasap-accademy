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

### Fase 1C: Challenges + Gamification + Tutor — DONE
- [x] Pyodide Web Worker runner (Python WASM in browser, carga desde CDN)
- [x] CodeEditor (Monaco, dynamic import) + SplitPane layout + OutputPanel + TestResults
- [x] Challenge page (/challenges/[challengeId]) con test runner — 3 challenges pre-renderizados
- [x] XPBar (en academy layout via XPBarClient client island), LevelUpModal
- [x] BadgeGrid, StreakCalendar, XPEvent
- [x] AI Tutor chat (TutorPanel + TutorMessage) con 3 preguntas gratis y XP cost warning
- [x] Profile page (/profile) con stats, BadgeGrid, StreakCalendar
- [x] Hooks: useXP, useStreak, useBadges, useLevelUp
- [x] Sidebar con streak indicator, layout con XPBar (top-24)
- [x] Build 34 páginas estáticas + lint: 0 errores, 0 warnings

### Fase 2: Curriculum Expansion v2 — DONE
- [x] Modules 3-10 (Core + Intermediate) — 40 lessons
- [x] Modules 11-14 (Advanced) — 20 lessons
- [x] Modules 15-17 (Expert: Agent Mode) — 15 lessons
- [x] Modules 18-20 (Specialist) — 15 lessons
- [x] Modules 21-22 (Production) — 10 lessons
- [x] Updated PRODUCT_PLAN.md curriculum to 23 modules
- [x] Updated Module 0 welcome lesson for 7 tiers
- [x] Created docs/curriculum/SYLLABUS.md
- [x] Created docs/exec-plans/04-curriculum-expansion_prd.md

### Fase 3: Polish & Challenges (future)
- [ ] Tier challenges (coding exercises per tier)
- [ ] New badges (10 proposed in SYLLABUS.md)
- [ ] Leaderboard enhancements
- [ ] Advanced challenges with Pyodide

## Curriculum — 23 Modules (v2)

> Syllabus detallado: [`docs/curriculum/SYLLABUS.md`](docs/curriculum/SYLLABUS.md)

### Tier 1: Foundation (Modules 0-2) ✅
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 0 | Setup & Onboarding | Project root, docker | ✅ 5 lessons |
| 1 | Webhook Pipeline | `app/webhook/` | ✅ 5 lessons |
| 2 | LLM Integration | `app/llm/`, `app/whatsapp/` | ✅ 5 lessons |

### Tier 2: Core (Modules 3-6) ✅
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 3 | Database & Persistence | `app/database/` | ✅ 5 lessons |
| 4 | Conversation & State | `app/conversation/`, `app/formatting/` | ✅ 5 lessons |
| 5 | Memory System | `app/memory/` | ✅ 5 lessons |
| 6 | Skills Framework | `app/skills/` | ✅ 5 lessons |

### Tier 3: Intermediate (Modules 7-10) ✅
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 7 | Tool Calling & Execution | `app/skills/executor.py` | ✅ 5 lessons |
| 8 | Intent Classification & Routing | `app/skills/router.py` | ✅ 5 lessons |
| 9 | Semantic Search & RAG | `app/embeddings/` | ✅ 5 lessons |
| 10 | Context Engineering | `app/context/` | ✅ 5 lessons |

### Tier 4: Advanced (Modules 11-14)
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 11 | Multimedia Processing | `app/audio/`, `app/formatting/` | ✅ 5 lessons |
| 12 | Guardrails & Quality Control | `app/guardrails/` | ✅ 5 lessons |
| 13 | Tracing & Observability | `app/tracing/` | ✅ 5 lessons |
| 14 | Evaluation & Self-Improvement | `app/eval/` | ✅ 5 lessons |

### Tier 5: Expert — Agent Mode (Modules 15-17)
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 15 | Agent Sessions & Reactive Loop | `app/agent/loop.py` | ✅ 5 lessons |
| 16 | Planner-Orchestrator | `app/agent/` | ✅ 5 lessons |
| 17 | Agentic Security & HITL | `app/security/` | ✅ 5 lessons |

### Tier 6: Specialist (Modules 18-20)
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 18 | Multi-Platform & MCP | `app/platforms/`, `app/mcp/` | ✅ 5 lessons |
| 19 | Knowledge Graphs & Provenance | `app/ontology/`, `app/provenance/` | ✅ 5 lessons |
| 20 | Operational Automation | `app/automation/` | ✅ 5 lessons |

### Tier 7: Production (Modules 21-22)
| # | Module | WasAP Source | Status |
|---|--------|-------------|--------|
| 21 | Performance Optimization | Various (`router.py`, `db.py`) | ✅ 5 lessons |
| 22 | Production Deploy & CI/CD | Docker, `.github/`, `scripts/` | ✅ 5 lessons |

**Total: 23 modules · 115 lessons · ~12,875 XP available**

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
