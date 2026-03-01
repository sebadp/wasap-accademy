# PRP — Fase 1C: Challenges + Gamification + Tutor

## Files to Create / Modify

### Dependencies
```
frontend/package.json  ← add: @monaco-editor/react
                           (pyodide se carga desde CDN en el worker)
```

### Pyodide Web Worker
```
frontend/public/
  pyodide-worker.js          ← Web Worker script (public = accesible sin bundler)

frontend/src/lib/pyodide/
  worker-client.ts           ← TypeScript wrapper para comunicarse con el worker
  types.ts                   ← RunResult, TestResult interfaces
```

### Challenge Components
```
frontend/src/components/editor/
  CodeEditor.tsx             ← Monaco Editor con dynamic import (ssr: false)
  OutputPanel.tsx            ← Panel de salida: stdout, errores, test results
  SplitPane.tsx              ← Layout editor izquierda / output derecha

frontend/src/components/challenge/
  ChallengeRunner.tsx        ← Orquesta editor + pyodide + submit
  TestResults.tsx            ← Muestra ✓/✗ por test case
```

### Gamification Components
```
frontend/src/components/gamification/
  XPBar.tsx                  ← Barra XP con nivel actual y progreso
  LevelUpModal.tsx           ← Modal de subida de nivel (client, animado)
  BadgeGrid.tsx              ← Grid 4 cols de badges locked/unlocked
  StreakCalendar.tsx         ← Grid 30 días con actividad
  XPEvent.tsx                ← Chip "+50 XP" que aparece y desaparece

frontend/src/components/tutor/
  TutorPanel.tsx             ← Panel lateral de chat con el tutor (client)
  TutorMessage.tsx           ← Burbuja de mensaje (user/assistant)
```

### Hooks
```
frontend/src/hooks/
  useXP.ts          ← fetch /api/xp, refresh on demand
  useStreak.ts      ← fetch /api/streaks
  useBadges.ts      ← fetch /api/badges
  useLevelUp.ts     ← detecta cambio de nivel, dispara modal
```

### Pages
```
frontend/src/app/(academy)/
  challenges/
    [challengeId]/
      page.tsx               ← Challenge page: editor + tutor panel
  profile/
    page.tsx                 ← Perfil: stats, badges, streak
```

### Layout Update
```
frontend/src/app/(academy)/layout.tsx      ← agregar XPBar entre Navbar y main
frontend/src/components/navigation/Sidebar.tsx  ← agregar streak indicator
```

---

## Phases

### Phase 1 — Instalar dependencias
- [ ] `npm install @monaco-editor/react`
- [ ] Verificar que `pyodide` se puede cargar desde CDN (no instalar como npm package)

### Phase 2 — Pyodide Web Worker
- [ ] Crear `public/pyodide-worker.js`:
  - Carga Pyodide desde CDN al inicializar
  - Escucha mensajes `{type: "run", code, testCode}`
  - Ejecuta código, captura stdout/stderr, corre tests
  - Responde con `{type: "result", stdout, stderr, testResults, passed}`
- [ ] Crear `src/lib/pyodide/types.ts` (RunRequest, RunResult, TestResult)
- [ ] Crear `src/lib/pyodide/worker-client.ts`:
  - Singleton worker (una instancia global)
  - `runCode(code, testCode): Promise<RunResult>`
  - Manejo de timeout (30s)

### Phase 3 — Editor + Output components
- [ ] `CodeEditor.tsx`: Monaco con `next/dynamic` + `ssr: false`, tema dark, lenguaje Python
- [ ] `OutputPanel.tsx`: tabs stdout/stderr/tests, colores por estado (pass=verde, fail=rojo)
- [ ] `SplitPane.tsx`: grid de dos columnas responsive, resizable (CSS solo, sin libs)
- [ ] `TestResults.tsx`: lista de ✓/✗ con nombre del test y mensaje de error si falló

### Phase 4 — Challenge page
- [ ] Crear `ChallengeRunner.tsx`:
  - Carga challenge desde backend (`GET /api/challenges/[id]`)
  - Inicia worker al montar
  - Botón "Ejecutar" → `runCode()` → muestra resultado
  - Botón "Enviar" (si pasan todos los tests) → `POST /api/challenges/submit` → XP → `useLevelUp`
- [ ] Crear `app/(academy)/challenges/[challengeId]/page.tsx`:
  - Layout: SplitPane izquierda (descripción + editor), derecha (output + TutorPanel)
  - `generateStaticParams` con los 3 challenges del backend

### Phase 5 — Gamification hooks
- [ ] `useXP.ts`: fetch `/api/xp`, retorna `{data, refresh}`. Cachea en estado local.
- [ ] `useStreak.ts`: fetch `/api/streaks`
- [ ] `useBadges.ts`: fetch `/api/badges`
- [ ] `useLevelUp.ts`: compara `data.current_level` antes/después de un XP event → si sube, retorna `{leveledUp, newLevel, newTitle}`

### Phase 6 — Gamification UI components
- [ ] `XPBar.tsx`:
  - Recibe `{totalXP, currentLevel, levelTitle, xpToNextLevel}`
  - Barra de progreso animada con CSS transition
  - Muestra nivel + título + XP numérico
- [ ] `LevelUpModal.tsx`:
  - Overlay con backdrop, centrado
  - Muestra nuevo nivel y título
  - Botón "Continuar" cierra el modal
  - Animación: scale + fade in con Tailwind
- [ ] `BadgeGrid.tsx`:
  - Grid 4 cols, cada badge: icono + nombre + descripción tooltip
  - Locked = gris + `opacity-40`
  - Unlocked = color + fecha de obtención
- [ ] `StreakCalendar.tsx`:
  - 30 celdas (días), coloreadas según `xp_earned` del calendario
  - Leyenda: 0 XP = gris, 1-99 = morado tenue, 100+ = morado brillante
- [ ] `XPEvent.tsx`: chip `+N XP` que aparece durante 2s y desaparece (CSS keyframe)

### Phase 7 — AI Tutor panel
- [ ] `TutorMessage.tsx`: burbuja con avatar, texto, timestamp
- [ ] `TutorPanel.tsx`:
  - Lista de mensajes (scroll automático al último)
  - Input + botón enviar
  - Llama a `POST /api/tutor/ask`
  - Muestra contador de preguntas gratis restantes
  - Si costo XP > 0: muestra advertencia "Esta pregunta cuesta 25 XP"

### Phase 8 — Profile page
- [ ] `app/(academy)/profile/page.tsx`:
  - Server component que carga datos del usuario (Supabase)
  - Sección stats: nivel, XP total, lecciones completadas, challenges pasados
  - `<BadgeGrid>` con badges reales del backend
  - `<StreakCalendar>` con datos reales
  - Avatar con iniciales del username si no hay foto

### Phase 9 — Layout + Sidebar update
- [ ] Actualizar `app/(academy)/layout.tsx`:
  - Añadir `<XPBar>` entre Navbar y `<main>` (requiere fetch de XP, hacer layout Client o usar Suspense)
- [ ] Actualizar `Sidebar.tsx`:
  - Añadir indicador de streak actual (llama a `useStreak`)

### Phase 10 — QA
- [ ] `npm run build` sin errores
- [ ] `npm run lint` sin warnings
- [ ] Test manual: ejecutar Python en el challenge → tests pasan → XP se suma → nivel sube → modal aparece
- [ ] Test manual: abrir tutor → hacer 3 preguntas gratis → 4ta pregunta muestra advertencia de XP

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Pyodide loading | CDN (jsdelivr) en el Worker | Sin npm package, sin bundler issues, cacheable por browser |
| Pyodide thread | Web Worker | No bloquear UI durante ejecución larga de Python |
| Monaco loading | `next/dynamic` con `ssr: false` | Monaco no es compatible con SSR |
| XPBar placement | Between Navbar and main | Visible en todas las páginas de la academia sin repetir en cada page |
| State management | Hooks locales con `useState` + `useEffect` | Sin Redux/Zustand — app simple, no necesita store global |
| Tutor panel | Sidebar en challenge page | Contexto siempre visible sin perder el editor |
| Level detection | Comparar antes/después en `useLevelUp` | No hay WebSocket — polling es suficiente para este caso |

---

## Pyodide Worker Protocol

```typescript
// Messages enviados al worker
type WorkerRequest =
  | { type: "init" }
  | { type: "run"; code: string; testCode: string; requestId: string }

// Messages recibidos del worker
type WorkerResponse =
  | { type: "ready" }
  | { type: "result"; requestId: string; stdout: string; stderr: string; testsPassed: number; testsTotal: number; passed: boolean }
  | { type: "error"; requestId: string; message: string }
```

---

## Challenge Data Format

Los challenges ya existen en el backend (`/api/challenges/[id]`). Los 3 definidos:
- `challenge-0-1`: Función Python básica (Módulo 0)
- `challenge-1-1`: Parsear un payload JSON simplificado (Módulo 1)
- `challenge-2-1`: Llamar a una API mock con httpx (Módulo 2)

El `test_code` del challenge se corre en Pyodide junto con el código del estudiante.
