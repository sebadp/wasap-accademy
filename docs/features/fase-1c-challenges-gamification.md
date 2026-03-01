# Feature: Fase 1C — Challenges + Gamification + AI Tutor

## What It Does

Sistema completo de desafíos de código: el estudiante escribe Python en Monaco Editor, lo ejecuta en el browser via Pyodide (WASM), ve los resultados test-by-test, y envía la solución al backend para ganar XP y badges. Complementado con un panel de XP/nivel/racha persistente y un tutor IA embebido en cada challenge.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Challenge Page                             │
│  ChallengeRunner (client)                                    │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │ LEFT PANE            │  │ RIGHT PANE                 │  │
│  │ description          │  │ OutputPanel                │  │
│  │ CodeEditor (Monaco)  │  │   stdout / TestResults     │  │
│  │                      │  │ TutorPanel                 │  │
│  │                      │  │   TutorMessage × N         │  │
│  └──────────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │ runCode()                        │ askTutor()
          ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────────┐
│  pyodide-worker.js   │          │  POST /api/tutor/ask     │
│  (Web Worker)        │          │  FastAPI backend          │
│  Pyodide WASM        │          │  Claude/Ollama            │
│  runs Python code    │          └──────────────────────────┘
│  + test functions    │
└──────────────────────┘
          │ RunResult
          ▼
┌──────────────────────┐
│  POST /api/           │
│  challenges/submit   │
│  backend awards XP   │
└──────────────────────┘
          │
          ▼
┌──────────────────────┐
│  Academy Layout       │
│  XPBarClient         │ ← useXP hook (refresh on demand)
│  Sidebar             │ ← useStreak hook (racha actual)
└──────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/public/pyodide-worker.js` | Web Worker: carga Pyodide desde CDN, ejecuta código + tests |
| `frontend/src/lib/pyodide/types.ts` | `RunResult`, `TestResult`, `WorkerStatus` |
| `frontend/src/lib/pyodide/worker-client.ts` | Singleton `PyodideWorkerClient`: `runCode()`, `onStatusChange()` |
| `frontend/src/components/editor/CodeEditor.tsx` | Monaco con `next/dynamic` + `ssr: false` |
| `frontend/src/components/editor/OutputPanel.tsx` | Tabs: stdout / tests con estado loading y empty state |
| `frontend/src/components/editor/TestResults.tsx` | ✓/✗ por test con mensaje de error |
| `frontend/src/components/editor/SplitPane.tsx` | Layout 50/50 con borde separador |
| `frontend/src/components/challenge/ChallengeRunner.tsx` | Orquesta editor + pyodide + submit + tutor |
| `frontend/src/app/(academy)/challenges/[challengeId]/page.tsx` | Challenge page (generateStaticParams: 3 challenges) |
| `frontend/src/hooks/useXP.ts` | Fetch `/api/xp`, retorna `{data, refresh}` |
| `frontend/src/hooks/useStreak.ts` | Fetch `/api/streaks` |
| `frontend/src/hooks/useBadges.ts` | Fetch `/api/badges` |
| `frontend/src/hooks/useLevelUp.ts` | Detecta cambio de nivel comparando antes/después |
| `frontend/src/components/gamification/XPBar.tsx` | Barra de progreso animada con nivel + título + XP |
| `frontend/src/components/gamification/XPBarClient.tsx` | Client wrapper de XPBar que usa `useXP` |
| `frontend/src/components/gamification/LevelUpModal.tsx` | Modal overlay al subir de nivel |
| `frontend/src/components/gamification/BadgeGrid.tsx` | Grid 4 cols locked/unlocked con tooltips |
| `frontend/src/components/gamification/StreakCalendar.tsx` | Grid 30 días coloreados por XP ganado |
| `frontend/src/components/gamification/XPEvent.tsx` | Chip "+N XP" animado que desaparece en 2s |
| `frontend/src/components/tutor/TutorMessage.tsx` | Burbuja de mensaje user/assistant con avatar |
| `frontend/src/components/tutor/TutorPanel.tsx` | Panel de chat: scroll automático, input, XP warning |
| `frontend/src/app/(academy)/profile/page.tsx` | Perfil: stats, BadgeGrid, StreakCalendar |
| `frontend/src/app/(academy)/layout.tsx` | XPBarClient entre Navbar y main |
| `frontend/src/components/navigation/Sidebar.tsx` | Streak indicator en el footer |

## Technical Walkthrough

### Step 1: Inicialización del Worker
1. `ChallengeRunner` monta → llama `pyodideClient.init()`
2. `PyodideWorkerClient.init()` crea un `new Worker("/pyodide-worker.js")`
3. El worker ejecuta `importScripts(PYODIDE_CDN)` y llama `loadPyodide()`
4. Cuando Pyodide está listo, el worker envía `{ type: "ready" }`
5. `worker-client.ts` recibe el mensaje y llama `setStatus("ready")`
6. El status se propaga vía `onStatusChange` → ChallengeRunner actualiza UI (oculta el banner "inicializando")

### Step 2: Cargar el challenge
1. `ChallengeRunner` monta → `getChallenge(challengeId)` → `GET /api/challenges/{id}`
2. El backend retorna `ChallengeDefinition`: `title`, `description`, `starter_code`, `test_code`, `xp_reward`
3. Se setea `code = starter_code` en el estado → Monaco Editor muestra el código inicial

### Step 3: Ejecutar código
1. Usuario escribe código → click "▶ Ejecutar"
2. `ChallengeRunner.handleRun()` llama `pyodideClient.runCode(code, challenge.test_code)`
3. `worker-client.ts` genera un UUID `requestId`, envía `{ type: "run", code, testCode, requestId }` al worker
4. El worker:
   a. Ejecuta `code` en Pyodide capturando stdout/stderr
   b. Extrae funciones `test_*` del `testCode` via regex
   c. Ejecuta cada test individualmente, captura pass/fail + error message
   d. Responde con `{ type: "result", stdout, stderr, testResults, testsPassed, testsTotal, passed, requestId }`
5. `worker-client.ts` resuelve la Promise → `ChallengeRunner` setea `result`
6. `OutputPanel` muestra stdout en tab "Salida", `TestResults` muestra ✓/✗ en tab "Tests"

### Step 4: Enviar solución
1. Si `result.passed === true` → aparece botón "✓ Enviar solución"
2. Click → `submitChallenge({ challenge_id, code, tests_passed, tests_total, passed: true })`
3. Backend: registra submission, verifica si es el primer intento exitoso
4. Si primer intento: otorga `xp_reward` XP (y `first_try` bonus si no hubo intentos fallidos)
5. ChallengeRunner muestra banner verde con XP ganado y badge si aplica

### Step 5: XP y gamificación
- `XPBarClient` en el layout usa `useXP` → fetch `/api/xp` al montar
- Para refrescar después de un submit, llamar `refresh()` del hook (conectar en Fase 2)
- `useLevelUp` compara `current_level` antes/después de un evento XP: si sube, dispara `LevelUpModal`
- Sidebar muestra `useStreak().data?.current_streak` en el footer

### Step 6: Tutor IA
1. `TutorPanel` recibe `challengeId` y `moduleId` como props
2. Usuario escribe pregunta → `askTutor({ challenge_id, question, module_id })`
3. Backend llama al LLM con contexto del módulo → retorna `{ answer, xp_cost, free_questions_remaining }`
4. `TutorPanel` actualiza `freeRemaining` y muestra advertencia si `xp_cost > 0`
5. Auto-scroll al último mensaje con `bottomRef.current?.scrollIntoView()`

## How to Extend

### Agregar un nuevo challenge
1. Editar `backend/app/api/challenges.py`, agregar entrada al dict `CHALLENGES`
2. Agregar `{ challengeId: "challenge-N" }` en `generateStaticParams` de la challenge page
3. No se necesitan más cambios — el resto es genérico

### Agregar más badges
Definir la lógica en `backend/app/services/gamification.py`, agregar el icono en `BadgeGrid.tsx`

### Reemplazar Monaco por otro editor
Solo cambiar `CodeEditor.tsx` — la interfaz `(value, onChange) => void` es estable

## Design Decisions

| Decision | Alternative Discarded | Reason |
|----------|----------------------|--------|
| Pyodide desde CDN en Worker | npm package `pyodide` | Sin bundler issues, cacheable por browser, worker isolation |
| Web Worker para Python | Main thread | Ejecutar Python bloquea el UI thread sin Worker |
| Monaco con `next/dynamic` + `ssr: false` | Import directo | Monaco usa APIs de browser, no compatible con SSR |
| Singleton `PyodideWorkerClient` | Una instancia por componente | Evita recargar los 10 MB de WASM en cada navegación |
| Challenge page con `generateStaticParams` | Server-rendered dinámico | Challenges son estáticos, mejor performance |
| XPBarClient como client island en layout | Hacer layout "use client" | Mínima superficie cliente, layout sigue siendo Server Component |
| TutorPanel en right pane de ChallengeRunner | Página separada / modal | Contexto siempre visible, no interrumpe el flujo de código |
| Comparación antes/después para `useLevelUp` | WebSocket push desde backend | No hay WebSocket en Fase 1, polling simple es suficiente |

## Gotchas & Edge Cases

- **Pyodide cold start**: primera carga tarda 3-8s (descarga ~10MB WASM). El banner "Inicializando Python..." cubre esto.
- **Sin re-init del worker**: el singleton persiste entre navegaciones. Si el usuario va a otra página y vuelve, el worker ya está listo.
- **Timeout 30s**: si el código entra en bucle infinito, el worker-client rechaza la promise y muestra el error en stderr.
- **Test extraction regex**: solo detecta funciones `def test_nombre():` sin argumentos. Tests con fixtures no funcionan en este modelo.
- **Submit idempotente**: el backend verifica si ya existe un submission exitoso. Enviar dos veces no duplica el XP.
- **XPBar height**: `XPBar` tiene `h-10` (2.5rem). El Sidebar usa `top-24` (6rem = 3.5rem navbar + 2.5rem XPBar). El challenge page usa `h-[calc(100vh-6rem)]`. Si se cambia la altura del XPBar, hay que actualizar esas tres clases.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PYODIDE_CDN` | `https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js` | URL del bundle WASM de Pyodide |
| `timeoutMs` en `runCode()` | `30_000` | Timeout de ejecución en ms |
| `FREE_QUESTIONS_TOTAL` en TutorPanel | `3` | Preguntas gratis por challenge |
| `XP_COST_PER_QUESTION` en TutorPanel | `25` | XP cobrado tras agotar preguntas gratis |
