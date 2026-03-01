# Testing: Fase 1C — Challenges + Gamification + AI Tutor

## Verify Feature Is Active

```bash
# 0. Base de datos local (si no está corriendo)
npx supabase start
# Verificar tablas: http://127.0.0.1:54323 (Supabase Studio)

# 1. Backend corriendo
cd backend && make dev
# → http://localhost:8000/docs

# 2. Frontend corriendo (con frontend/.env.local configurado)
cd frontend && npm run dev
# → Navegar a http://localhost:3000/challenges/challenge-0
```

## Main Test Cases

### Pyodide + Editor

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 1 | Navegar a `/challenges/challenge-0` | GET | Banner "Inicializando Python..." aparece brevemente, luego desaparece |
| 2 | Worker listo | Esperar ~5s | Botón "▶ Ejecutar" habilitado |
| 3 | Ver editor | Carga página | Monaco muestra `starter_code` de Hello Bot con syntax highlighting Python |
| 4 | Ejecutar código sin modificar | Click "▶ Ejecutar" | OutputPanel muestra "Sin salida." en tab Salida, Tests muestra 0/1 ✗ |
| 5 | Escribir solución correcta | `return f"Hello, {name}! Welcome to AgentCraft."` | Tests: 1/1 ✓, tab Tests en verde |
| 6 | Tests pasan | Ver action bar | Botón "✓ Enviar solución" aparece en verde |
| 7 | Código con stdout | `print("hola")` + ejecutar | Tab "Salida" muestra `hola` en verde |
| 8 | Código con error | `syntax error` | Tab "Salida" muestra stderr en rojo |
| 9 | Código con bucle infinito | `while True: pass` | Después de 30s: error "Execution timed out (30s)" en stderr |

### Challenge Submit + XP

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 10 | Enviar solución correcta (primer intento) | Click "✓ Enviar solución" autenticado | Banner verde: "¡Challenge completado! +300 XP" (200 + 100 first_try) |
| 11 | Enviar solución ya enviada | Submit segunda vez | Banner verde: "¡Challenge completado! +0 XP" (idempotente) |
| 12 | Enviar solución incorrecta | `passed: false` al backend | No aparece botón de submit (UI lo bloquea cuando passed=false) |
| 13 | Submit sin sesión | Sin token de auth | Error en el banner: "API 403..." |

### Gamification UI

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 14 | XPBar en layout | Navegar a cualquier página de academia | Barra visible debajo del Navbar con nivel, título y XP |
| 15 | XPBar sin sesión / API down | Error en useXP | Div placeholder de misma altura (no rompe layout) |
| 16 | Sidebar — streak | Usuario con actividad | Footer del sidebar muestra "N días de racha" en naranja |
| 17 | Sidebar — sin streak | Usuario nuevo | Footer no muestra indicador de racha |
| 18 | Profile page | `/profile` | Muestra StatCards: XP, Nivel, Racha actual, Racha máxima |
| 19 | BadgeGrid — sin badges | Usuario nuevo | Grid vacío o mensaje "Completá challenges" |
| 20 | BadgeGrid — con badge | Después de primer challenge | Badge desbloqueado con color, icono y fecha |
| 21 | BadgeGrid — badge locked | Badges no obtenidos | Icono gris, `opacity-40` |
| 22 | StreakCalendar — sin actividad | Días sin XP | Celdas en gris (`bg-zinc-800`) |
| 23 | StreakCalendar — con actividad | Días con XP < 100 | Celdas en morado tenue |
| 24 | StreakCalendar — alta actividad | Días con XP ≥ 100 | Celdas en morado brillante |

### AI Tutor

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 25 | TutorPanel visible | Abrir challenge | Panel "Tutor IA" en la mitad inferior derecha |
| 26 | Contador preguntas | Sin preguntas hechas | Badge: "3 preguntas gratis" |
| 27 | Hacer pregunta | "¿Cómo completo este challenge?" | Mensaje aparece como burbuja user, typing indicator, respuesta del tutor |
| 28 | Auto-scroll | Conversación larga | Panel scrollea al último mensaje automáticamente |
| 29 | Enter envía | Presionar Enter en el input | Envía la pregunta |
| 30 | Shift+Enter no envía | Presionar Shift+Enter | Inserta salto de línea |
| 31 | Tres preguntas gratis | Hacer 3 preguntas | Badge cambia a "25 XP/pregunta" |
| 32 | Cuarta pregunta | Hacer 4ta pregunta | Warning "Esta pregunta cuesta 25 XP" aparece encima del input |
| 33 | Backend error en tutor | Backend caído | Mensaje de error como burbuja del asistente |

### Build + Lint

| # | Action | Expected Result |
|---|--------|-----------------|
| 34 | `npm run build` | 34 páginas estáticas generadas, 0 errores TypeScript |
| 35 | `npm run lint` | 0 errores, 0 warnings |
| 36 | Challenges en el build output | `/challenges/challenge-0`, `/challenges/challenge-1`, `/challenges/challenge-2` aparecen como SSG |
| 37 | `/profile` en el build | Aparece como `○ (Static)` |

## Edge Cases & Validations

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | Navegar entre challenges rápido | Worker singleton no se re-inicializa, sigue en estado "ready" |
| 2 | Challenge no existente en backend | `getChallenge()` rechaza → console.error, editor queda en "Cargando challenge..." |
| 3 | Worker falla al cargar | `onerror` del worker setea status "error" → botón "Ejecutar" disabled indefinidamente |
| 4 | Pyodide sin internet | `importScripts(CDN)` falla → worker error → status "error" en cliente |
| 5 | Test con múltiples asserts | Primer assert falla → pytest-style corta, muestra el error específico |
| 6 | Code con imports (`import math`) | Pyodide tiene stdlib completa — funciona |
| 7 | Code con `import requests` | No disponible en Pyodide — stderr muestra ModuleNotFoundError |
| 8 | Ejecutar mientras ya corre | Botón "Ejecutar" disabled con `workerStatus !== "ready"` — imposible |

## Verify in Logs

```bash
# Worker lifecycle (browser DevTools → Console)
# Al cargar el challenge por primera vez:
#   [Worker] Pyodide loading...      (puede tardar 3-8s)
#   [Worker] Pyodide ready
# Al ejecutar:
#   PyodideWorkerClient runCode() called
#   Worker response: { type: "result", testsPassed: 1, testsTotal: 1, passed: true }

# Network tab al enviar solución:
# POST http://localhost:8000/api/challenges/submit
# → 200 { xp_awarded: 300, new_total_xp: 350, badge_unlocked: "first_blood" }

# Network tab tutor:
# POST http://localhost:8000/api/tutor/ask
# → 200 { answer: "...", xp_cost: 0, free_questions_remaining: 2 }
```

## Database Verification

```sql
-- Verificar submission guardado
SELECT * FROM challenge_submissions
WHERE user_id = '<user_id>'
ORDER BY submitted_at DESC LIMIT 5;

-- Verificar XP otorgado
SELECT * FROM xp_events
WHERE user_id = '<user_id>'
ORDER BY created_at DESC LIMIT 5;

-- Verificar badge desbloqueado (si aplica)
SELECT * FROM user_badges
WHERE user_id = '<user_id>';

-- Verificar XP total actualizado
SELECT total_xp, current_level FROM user_profiles
WHERE user_id = '<user_id>';
```

## Graceful Degradation

| Component | Falla | Comportamiento |
|-----------|-------|---------------|
| Pyodide CDN inaccesible | Worker error | Status "error", botón Ejecutar disabled, banner no desaparece |
| Backend caído en `getChallenge()` | fetch rechaza | Editor queda en "Cargando challenge...", error en console |
| Backend caído en `submitChallenge()` | fetch rechaza | Error message en banner rojo bajo el action bar |
| Backend caído en `useXP()` | silently fail | XPBar muestra placeholder div de misma altura |
| Backend caído en `askTutor()` | mensaje error | Burbuja del asistente con texto del error |
| Sin autenticación | API 403 | Submit muestra error, Tutor muestra error, XPBar no carga |

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| "Inicializando Python..." nunca desaparece | Pyodide CDN bloqueado o sin internet | Verificar red, revisar Console del browser |
| Botón "Ejecutar" siempre disabled | Worker en estado "error" | Revisar Console → errores del worker. Recargar página. |
| Tests pasan en local pero no en worker | Imports no disponibles (requests, numpy) | Pyodide tiene stdlib + pyodide packages. Ver [lista de paquetes](https://pyodide.org/en/stable/usage/packages-in-pyodide.html) |
| "Execution timed out" en código simple | Bucle implícito o recursión infinita | Revisar el código del test_code y el starter |
| XPBar no aparece | `useXP` falla (no hay sesión o backend caído) | Placeholder invisible de misma altura — verificar red |
| TutorPanel no responde | Backend caído o NEXT_PUBLIC_BACKEND_URL no configurado | Ver `.env.local`, verificar CORS en FastAPI |
| Build falla con "Module not found" en tutor | Importación incorrecta en TutorPanel | Verificar `@/components/tutor/TutorMessage` path |
| Sidebar overlay sobre contenido | `top-24` no coincide con navbar+xpbar | Verificar alturas: Navbar `h-14` + XPBar `h-10` = `top-24` |
