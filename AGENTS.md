# AGENTS.md — AgentCraft Navigation Map

## 1. Documentation Map

| Document | Location | Purpose |
|----------|----------|---------|
| Conventions | `CLAUDE.md` | Stack, patterns, code quality |
| Navigation | `AGENTS.md` (this file) | Where to find everything |
| Roadmap | `PRODUCT_PLAN.md` | Vision, phases, module list |
| Exec Plans | `docs/exec-plans/` | PRD+PRP for complex features |
| Feature Docs | `docs/features/` | Walkthroughs of implemented features |
| Testing Docs | `docs/testing/` | Manual testing guides |

## 2. Code Map

### Backend (FastAPI)
| Domain | Key Files | Notes |
|--------|-----------|-------|
| App Entry | `backend/app/main.py` | Lifespan pattern, CORS, router includes |
| Config | `backend/app/config.py` | Pydantic Settings, all env vars |
| Auth | `backend/app/auth/middleware.py` | Supabase JWT validation |
| Progress API | `backend/app/api/progress.py` | Lesson/module progress CRUD |
| XP API | `backend/app/api/xp.py` | XP queries + award endpoint |
| Badges API | `backend/app/api/badges.py` | Badge queries + unlock |
| Streaks API | `backend/app/api/streaks.py` | Streak tracking |
| Challenges API | `backend/app/api/challenges.py` | Challenge data + submission |
| Tutor API | `backend/app/api/tutor.py` | AI tutor endpoint |
| Gamification | `backend/app/services/gamification.py` | XP calc, levels, badges |
| Tutor Service | `backend/app/services/tutor.py` | Claude/Ollama integration |
| Progress Service | `backend/app/services/progress.py` | Prereqs, unlock logic |
| DB Client | `backend/app/database/supabase_client.py` | Supabase Python SDK |
| Tests | `backend/tests/` | pytest, asyncio |

### Frontend (Next.js 15)
| Domain | Key Files | Notes |
|--------|-----------|-------|
| Root Layout | `frontend/src/app/layout.tsx` | Providers, global styles |
| Landing | `frontend/src/app/page.tsx` | Public landing page |
| Auth | `frontend/src/app/(auth)/` | Login, signup, callback |
| Academy Layout | `frontend/src/app/(academy)/layout.tsx` | Sidebar + XP bar (protected) |
| Skill Tree | `frontend/src/app/(academy)/map/page.tsx` | SVG skill tree |
| Modules | `frontend/src/app/(academy)/modules/` | Module + lesson pages |
| Challenges | `frontend/src/app/(academy)/challenges/` | Pyodide challenge page |
| Profile | `frontend/src/app/(academy)/profile/page.tsx` | User profile + stats |
| MDX Components | `frontend/src/components/mdx/` | 10 custom components |
| Editor | `frontend/src/components/editor/` | Monaco + Pyodide runner |
| Gamification UI | `frontend/src/components/gamification/` | XP, badges, streaks |
| Navigation | `frontend/src/components/navigation/` | Sidebar, navbar, breadcrumb |
| Tutor | `frontend/src/components/tutor/` | Chat + context provider |
| Auth Components | `frontend/src/components/auth/` | Provider + protected route |
| Supabase Lib | `frontend/src/lib/supabase/` | Client + server clients |
| API Client | `frontend/src/lib/api/client.ts` | Backend fetch wrapper |
| Content Loader | `frontend/src/lib/content/` | MDX + challenge loaders |
| Pyodide Engine | `frontend/src/lib/pyodide/` | WASM Python runtime |
| Gamification Lib | `frontend/src/lib/gamification/` | XP/level constants |
| Hooks | `frontend/src/hooks/` | useXP, useProgress, etc. |
| Types | `frontend/src/types/` | TypeScript interfaces |
| MDX Content | `frontend/content/modules/` | Lesson MDX files |
| Challenge Code | `frontend/content/challenges/` | Starter code + tests |

### Database (Supabase)
| Migration | File | Tables |
|-----------|------|--------|
| 001 | `supabase/migrations/001_auth_profiles.sql` | profiles |
| 002 | `supabase/migrations/002_progress.sql` | lesson_progress, module_progress, challenge_submissions |
| 003 | `supabase/migrations/003_gamification.sql` | xp_events, user_xp, user_badges, user_streaks, streak_history |
| 004 | `supabase/migrations/004_tutor.sql` | tutor_usage, tutor_free_questions |

## 3. Development Workflow

```
PLAN → IMPLEMENT → TEST → DOCUMENT → PR
```

1. **PLAN**: For complex features (>3 files), create PRD+PRP in `docs/exec-plans/`
2. **IMPLEMENT**: Write code following patterns in `CLAUDE.md`
3. **TEST**: Backend: `pytest` / Frontend: `npm run build && npm run lint`
4. **DOCUMENT**: Create feature doc + testing doc (MANDATORY)
5. **PR**: Commit with descriptive message

## 4. Documentation Protocol (MANDATORY)

When completing any feature:
- [ ] Create `docs/features/<feature-name>.md` using `docs/features/TEMPLATE.md`
- [ ] Create `docs/testing/<feature-name>_testing.md` using `docs/testing/TEMPLATE.md`
- [ ] Update `PRODUCT_PLAN.md` phase status
- [ ] Update this file (`AGENTS.md`) code map if new domains/files added
- [ ] Update `CLAUDE.md` if new conventions established

**Rule: A feature is NOT complete without documentation.**

## 5. Current State & Next Steps

### Completed
- [x] Paso 0: Scaffolding + documentation framework

### In Progress
- [ ] Fase 1A: Backend + Frontend foundation

### Next
- [ ] Fase 1B: MDX content + components
- [ ] Fase 1C: Challenges + gamification + tutor

## 6. Project Principles

1. **Learn from production code**: Every lesson maps to real WasAP source code
2. **Gamification drives retention**: XP, badges, streaks, leaderboard
3. **Challenges are browser-native**: Pyodide = zero server cost
4. **Documentation is mandatory**: Replicated from WasAP's proven framework
5. **Progressive complexity**: Setup → Webhook → LLM → Memory → Skills → Agents
