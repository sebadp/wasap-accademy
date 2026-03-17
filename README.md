   # AgentCraft

Plataforma gamificada para aprender Inteligencia Artificial Generativa construyendo **WasAP**: un asistente de WhatsApp con IA real — memoria, RAG, tool calling, agentes, trazabilidad y guardrails.

Los estudiantes no aprenden con ejemplos de juguete. Aprenden entendiendo, modificando y extendiendo código de producción real (85 archivos Python, 316 tests, 15 skills).

---

## Demo rápida

```
/map          → Skill Tree con 17 módulos
/modules      → Lecciones MDX interactivas
/challenges   → Editor Python en el browser (Pyodide)
/profile      → XP, nivel, badges, racha de actividad
```

---

## Stack

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Frontend | Next.js 16 + TypeScript | App Router, SSR, MDX, Monaco Editor |
| Estilos | Tailwind CSS | Dark theme, design system propio |
| Contenido | MDX + next-mdx-remote + shiki | Lecciones interactivas con quiz y syntax highlighting |
| Auth | Supabase Auth | Email/password, OAuth, JWT |
| Base de datos | Supabase (PostgreSQL + RLS) | Perfiles, progreso, XP, badges, streaks, tutor |
| Backend | FastAPI + Python 3.11 | API REST, gamificación, tutor IA |
| Challenges | Pyodide (Python WASM) | Python en el browser, sin backend |
| Tutor IA | Claude API / Ollama | Tutor contextual con historial por challenge |
| Deploy | Vercel (frontend) + Docker (backend) | Frontend estático + backend Python separado |

---

## Estructura del proyecto

```
wasap-accademy/
├── frontend/                    # Next.js 16
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/          # Login, signup, OAuth callback
│   │   │   └── (academy)/       # Layout protegido
│   │   │       ├── map/         # Skill Tree
│   │   │       ├── modules/     # Lecciones MDX
│   │   │       ├── challenges/  # Editor Python (Pyodide)
│   │   │       └── profile/     # Stats, badges, streak
│   │   ├── components/
│   │   │   ├── editor/          # CodeEditor, OutputPanel, SplitPane, TestResults
│   │   │   ├── challenge/       # ChallengeRunner
│   │   │   ├── gamification/    # XPBar, LevelUpModal, BadgeGrid, StreakCalendar
│   │   │   ├── tutor/           # TutorPanel, TutorMessage
│   │   │   ├── mdx/             # 9 componentes MDX personalizados
│   │   │   └── navigation/      # Navbar, Sidebar, LessonSidebar, LessonNav
│   │   ├── hooks/               # useXP, useStreak, useBadges, useLevelUp
│   │   ├── lib/
│   │   │   ├── api/             # Cliente HTTP tipado
│   │   │   ├── content/         # Loader de MDX (gray-matter)
│   │   │   ├── pyodide/         # Worker client singleton
│   │   │   └── supabase/        # client.ts, server.ts, middleware.ts
│   │   └── types/               # Interfaces TypeScript alineadas al backend
│   ├── content/modules/         # 15 lecciones .mdx (módulos 0, 1, 2)
│   └── public/
│       └── pyodide-worker.js    # Web Worker — ejecuta Python en el browser
│
├── backend/                     # FastAPI
│   └── app/
│       ├── api/                 # Routers: progress, xp, badges, streaks,
│       │   │                    #          challenges, tutor, leaderboard
│       ├── services/            # gamification.py, progress.py, tutor.py
│       ├── auth/                # Middleware JWT (Supabase)
│       └── database/            # Cliente Supabase
│
├── supabase/migrations/         # SQL: 001 profiles, 002 progress,
│                                #       003 gamification, 004 tutor
├── docs/
│   ├── exec-plans/              # PRD + PRP de cada fase (antes de implementar)
│   ├── features/                # Walkthroughs técnicos de features implementadas
│   └── testing/                 # Guías de testing manual
├── PRODUCT_PLAN.md              # Visión, fases, currículo, sistema de gamificación
├── AGENTS.md                    # Mapa de código para agentes IA
├── CLAUDE.md                    # Convenciones del proyecto
└── docker-compose.yml           # Backend en Docker
```

---

## Setup local

### Requisitos

- Node.js 20+
- Python 3.11+
- Docker (para Supabase local)
- Anthropic API key (o Ollama local para el tutor)

### 1. Supabase local (recomendado)

El proyecto usa la Supabase CLI para levantar un stack completo local (PostgreSQL + Auth + API) sin necesidad de una cuenta en la nube.

```bash
# Levantar Supabase (primera vez descarga ~500MB de imágenes Docker)
npx supabase start

# Las migraciones se aplican automáticamente.
# Al terminar verás las URLs y keys locales.
```

Crear `frontend/.env.local` con los valores del output:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY del output>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY del output>
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

> **Tip:** Correr `npx supabase status --output env` para ver todos los valores en formato copiable.

**Herramientas locales disponibles:**

| Herramienta | URL |
|-------------|-----|
| Supabase Studio (GUI DB) | http://127.0.0.1:54323 |
| API / Auth | http://127.0.0.1:54321 |
| PostgreSQL directo | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

```bash
# Apagar cuando termines
npx supabase stop
```

### Alternativa: Supabase cloud

Si preferís usar un proyecto en la nube:

1. Crear proyecto en [supabase.com](https://supabase.com) (plan gratuito)
2. Ejecutar las migraciones en el editor SQL (Settings → SQL Editor):
   `supabase/migrations/001_auth_profiles.sql` → ... → `004_tutor.sql`
3. Copiar las keys desde Settings → API

| Variable | Dónde obtenerla |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |

### 2. Backend

```bash
cd backend
pip install -e ".[dev]"
make dev           # uvicorn en :8000 con reload
```

Con Docker:

```bash
docker-compose up --build
```

Verificar: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # Next.js en :3000
```

Abrir: `http://localhost:3000`

---

## Comandos útiles

### Frontend

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción (verifica tipos + páginas estáticas)
npm run lint         # ESLint
```

### Backend

```bash
make dev             # uvicorn con reload
make check           # lint + typecheck + tests (todo junto)
make test            # pytest -v
make lint            # ruff check
make format          # ruff format
```

---

## Sistema de gamificación

### Niveles

| Nivel | Título | XP requerido |
|-------|--------|-------------|
| 1 | Novice | 0 |
| 2 | Apprentice | 500 |
| 3 | Student | 1.500 |
| 4 | Practitioner | 3.500 |
| 5 | Builder | 6.500 |
| 6 | Engineer | 10.000 |
| 7 | Architect | 15.000 |
| 8 | Master | 22.000 |
| 9 | Grandmaster | 32.000 |
| 10 | Sage | 45.000 |

### XP por acción

| Acción | XP |
|--------|----|
| Completar lección | 50 |
| Completar challenge | 200 |
| Primer intento exitoso (challenge) | +100 |
| Racha 3 días | 50 |
| Racha 7 días | 150 |
| Racha 30 días | 500 |

### Tutor IA

- 3 preguntas gratis por challenge
- A partir de la 4ta: 25 XP por pregunta
- Contexto-aware: sabe en qué módulo y challenge está el estudiante

---

## Challenges (Python en el browser)

Los challenges se ejecutan 100% en el browser usando **Pyodide** (Python WASM):

1. Un Web Worker carga Pyodide desde CDN al iniciar la sesión (~10MB, se cachea)
2. El estudiante escribe código en Monaco Editor
3. Click "Ejecutar" → el código y los tests viajan al worker
4. El worker ejecuta cada función `test_*` y reporta pass/fail con errores
5. Si todos los tests pasan → botón "Enviar solución" → POST al backend → XP

No se ejecuta ningún código Python en el servidor para los challenges.

---

## Documentación interna

| Doc | Descripción |
|-----|-------------|
| [`PRODUCT_PLAN.md`](PRODUCT_PLAN.md) | Visión, roadmap, currículo de 17 módulos |
| [`AGENTS.md`](AGENTS.md) | Mapa completo de archivos del proyecto |
| [`CLAUDE.md`](CLAUDE.md) | Convenciones de código (para agentes IA y devs) |
| [`docs/features/`](docs/features/) | Walkthrough técnico de cada feature implementada |
| [`docs/testing/`](docs/testing/) | Guías de testing manual por feature |
| [`docs/exec-plans/`](docs/exec-plans/) | PRD + PRP de cada fase (decisiones de diseño) |

---

## Estado del proyecto

| Fase | Estado |
|------|--------|
| Scaffolding + docs framework | ✅ Completo |
| Fase 1A: Backend + Frontend Foundation | ✅ Completo |
| Fase 1B: MDX Content + Components | ✅ Completo |
| Fase 1C: Challenges + Gamification + Tutor | ✅ Completo |
| Fase 2: Módulos 3-16 + Leaderboard | Próximamente |
