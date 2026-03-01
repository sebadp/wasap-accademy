# Feature: Fase 1A — Backend + Frontend Foundation

## What It Does

Provee la infraestructura completa de la plataforma: API FastAPI con autenticación Supabase, base de datos con RLS, y el frontend Next.js con auth, layout de academia y cliente de API tipado.

## Architecture

```
Browser (Next.js 16)
  ├── /login, /signup → Supabase Auth
  ├── /map            → Skill Tree (public dentro de academy)
  └── middleware.ts   → protege rutas (academy)

FastAPI (backend/)
  ├── JWT middleware   ← valida token Supabase en cada request
  ├── /api/progress   ← CRUD de progreso lección/módulo
  ├── /api/xp         ← XP total, nivel, eventos recientes
  ├── /api/badges     ← badges desbloqueados
  ├── /api/streaks    ← streak actual + calendar
  ├── /api/challenges ← definiciones + submit
  ├── /api/tutor      ← preguntas al AI tutor
  └── /api/leaderboard← top 20 por XP

Supabase (PostgreSQL + Auth)
  ├── profiles        ← auto-creado en signup via trigger
  ├── lesson_progress / module_progress / challenge_submissions
  ├── xp_events / user_xp / user_badges / user_streaks
  └── tutor_usage / tutor_free_questions
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI app, lifespan, CORS, routers |
| `backend/app/config.py` | Pydantic Settings, `@lru_cache` |
| `backend/app/auth/middleware.py` | Validación JWT Supabase |
| `backend/app/services/gamification.py` | XP, niveles (10), badges (8) |
| `backend/app/services/progress.py` | Prereqs, unlock de módulos |
| `backend/app/services/tutor.py` | Claude/Ollama, free/paid model |
| `backend/app/models.py` | Todos los Pydantic models |
| `frontend/src/middleware.ts` | Protección de rutas Next.js |
| `frontend/src/lib/supabase/client.ts` | Cliente browser (SSR-safe) |
| `frontend/src/lib/supabase/server.ts` | Cliente server (cookies) |
| `frontend/src/lib/api/client.ts` | Typed fetch wrapper para backend |
| `frontend/src/types/index.ts` | TypeScript interfaces (backend-aligned) |
| `frontend/src/app/(auth)/` | Login, signup, OAuth callback |
| `frontend/src/app/(academy)/layout.tsx` | Navbar + Sidebar layout |
| `frontend/src/app/(academy)/map/page.tsx` | Skill Tree (/map) |
| `supabase/migrations/001-004` | Schema completo con RLS |

## Technical Walkthrough

### Step 1: Auth flow
1. Usuario hace signup en `/signup` → Supabase crea el user
2. Trigger SQL en `profiles` inserta fila automáticamente
3. Triggers adicionales crean `user_xp` y `user_streaks`
4. Middleware Next.js detecta sesión y redirige a `/map`

### Step 2: Request autenticado al backend
1. Browser obtiene `session.access_token` de Supabase
2. `src/lib/api/client.ts` inyecta `Authorization: Bearer <token>`
3. Backend middleware valida el JWT contra Supabase JWKS
4. Handler recibe `user_id` del token decodificado via `Depends(get_user_id)`

### Step 3: Gamification service
1. `award_xp(user_id, amount, source)` → inserta en `xp_events`, actualiza `user_xp`
2. `calculate_level(total_xp)` → devuelve nivel 1-10 con título
3. `check_badge_unlock(user_id)` → evalúa condiciones de los 8 badges

## Design Decisions

| Decision | Alternative Discarded | Reason |
|----------|----------------------|--------|
| Supabase JWT en backend | Supabase solo en frontend | Backend necesita RLS bypass para operaciones de admin |
| Pydantic Settings + `@lru_cache` | `os.environ` directo | Tipado fuerte, fallo temprano, singleton |
| `@supabase/ssr` en frontend | `@supabase/auth-helpers-nextjs` | Oficial, compatible con Next.js 15+ App Router |
| Dark theme via CSS vars | Tailwind config | Más flexible para theming dinámico |

## Gotchas & Edge Cases

- **Table mismatch**: migración 003 crea `user_xp`, backend hace queries usando ese nombre. Si cambia el schema, actualizar `services/gamification.py`.
- **Supabase JWT expiry**: el middleware Next.js llama `getUser()` (no `getSession()`) que valida con el servidor — más seguro pero requiere un round-trip.
- **CORS**: `cors_origins` en Settings incluye `http://localhost:3000`. En producción agregar la URL de Vercel.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | — | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — | Anon key pública |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Service role (solo backend) |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | URL del FastAPI |
| `ANTHROPIC_API_KEY` | — | Para el AI tutor |
| `TUTOR_PROVIDER` | `claude` | `claude` o `ollama` |
