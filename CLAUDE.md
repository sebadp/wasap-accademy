# CLAUDE.md — AgentCraft Conventions

## Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + MDX
- **Backend**: FastAPI + Python 3.11+ + Pydantic Settings
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Challenges**: Pyodide (Python WASM in browser)
- **Deploy**: Vercel (frontend) + separate Python backend

## Project Structure
```
wasap-accademy/
├── backend/          # FastAPI Python backend
│   ├── app/          # Application code
│   │   ├── api/      # Route handlers
│   │   ├── services/ # Business logic
│   │   ├── auth/     # JWT middleware
│   │   └── database/ # Supabase client
│   └── tests/        # pytest tests
├── frontend/         # Next.js 15 frontend
│   ├── src/app/      # App Router pages
│   ├── src/components/  # React components
│   ├── src/lib/      # Utilities and clients
│   └── content/      # MDX lessons + challenges
├── supabase/         # SQL migrations
└── docs/             # Documentation
```

## Code Quality

### Backend (Python)
- Linter: `ruff check .` / `ruff format .`
- Type checking: `mypy app/`
- Tests: `pytest tests/ -v` with `asyncio_mode="auto"`
- Run all: `cd backend && make check`

### Frontend (TypeScript)
- Linter: `eslint` (eslint-config-next)
- Types: `tsc --noEmit`
- Formatter: `prettier`
- Build check: `cd frontend && npm run build && npm run lint`

## Key Patterns

### Backend
- **Lifespan pattern** for FastAPI startup/shutdown
- **Pydantic Settings** for all configuration (no raw os.environ)
- **Dependency injection** via FastAPI's `Depends()`
- **Supabase JWT validation** middleware on all `/api/` routes
- **Service layer** separates business logic from route handlers

### Frontend
- **App Router** with route groups: `(auth)` and `(academy)`
- **MDX** for lesson content with custom components
- **Supabase Auth** with server-side and client-side clients
- **Pyodide** runs Python challenges in browser (Web Worker)
- **Dynamic imports** for Monaco Editor and Pyodide (no SSR)

## Documentation Protocol (MANDATORY)
A feature is NOT complete without documentation:
1. Create feature doc in `docs/features/` using TEMPLATE.md
2. Create testing doc in `docs/testing/` using TEMPLATE.md
3. Update `PRODUCT_PLAN.md` with feature status
4. Update `AGENTS.md` if new files/domains added
5. For complex features (>3 files): create PRD+PRP in `docs/exec-plans/` BEFORE implementing

## Naming Conventions
- Python: `snake_case` for files, functions, variables
- TypeScript: `PascalCase` for components, `camelCase` for functions/variables
- API routes: `/api/resource` (RESTful, lowercase, plural)
- MDX files: `XX-slug.mdx` (numbered for ordering)
- SQL migrations: `NNN_description.sql`

## Environment Variables
See `.env.example` for all required variables. Never commit secrets.
