# PRD — Fase 1C: Challenges + Gamification + Tutor

## Objetivo

Completar la experiencia de aprendizaje de AgentCraft: el runner de Python en el browser (Pyodide), la UI de gamificación (XP, badges, streaks), el tutor IA integrado y la página de perfil. Al terminar esta fase, un estudiante puede hacer el ciclo completo: leer → desafiar → ganar XP → ver progreso.

## Scope

### In scope
- **Pyodide runner**: Web Worker que ejecuta Python WASM, sin servidor
- **CodeEditor**: Monaco Editor con dynamic import (sin SSR)
- **Challenge page**: `/challenges/[challengeId]` con editor + output + test runner
- **XPBar**: barra de progreso de XP en el layout de academia (sticky top)
- **LevelUpModal**: modal que aparece al subir de nivel, animado
- **BadgeGrid**: grid de badges con estado locked/unlocked en perfil
- **StreakCalendar**: calendario de 30 días de actividad
- **Hooks**: `useXP`, `useStreak`, `useBadges` con fetch del backend
- **AI Tutor**: panel de chat lateral en la página de challenge (3 preguntas gratis)
- **Profile page**: `/profile` con stats, avatar, nivel, badges y streak
- **Sidebar update**: agregar XPBar y streak indicator al Sidebar existente

### Out of scope
- Leaderboard page (Fase 2)
- Desafíos para módulos 3-16 (Fase 2)
- Animaciones complejas / confetti (nice-to-have, Fase 2)
- Multiplayer / social features (Fase 2)
- Push notifications (Fase 2)

## Use Cases

1. **UC1 – Estudiante completa un challenge**:
   Entra a `/challenges/challenge-0-1`, escribe código en Monaco, hace click en "Ejecutar". Pyodide corre el código y los tests en el browser. Si pasa: POST al backend → XP → badge check → LevelUpModal si subió de nivel.

2. **UC2 – Estudiante pregunta al tutor**:
   En la página del challenge, hace click en "Preguntar al tutor", escribe su duda. El frontend hace POST `/api/tutor/ask`. Las primeras 3 preguntas son gratis; las siguientes cuestan 25 XP. La respuesta aparece en el panel de chat.

3. **UC3 – Estudiante ve su XP en tiempo real**:
   Después de completar una lección o challenge, la XPBar en el layout se actualiza sin recargar la página.

4. **UC4 – Estudiante revisa su perfil**:
   Navega a `/profile`, ve su avatar, nivel actual, XP total, badges obtenidos (y los pendientes en gris), y el streak calendar de los últimos 30 días.

5. **UC5 – LevelUp**:
   Al completar un challenge que lleva al usuario al siguiente nivel, aparece el `LevelUpModal` con el nuevo título y un botón "Continuar".

## Constraints

- **Monaco Editor**: dynamic import solo (`next/dynamic`), sin SSR
- **Pyodide**: debe correr en un Web Worker para no bloquear el UI thread
- **Pyodide bundle**: ~10MB — cachear en el worker, no recargar entre challenges
- **Sin nuevo backend**: toda la gamification ya está en la API (Fase 1A). Solo conectar UI
- **Sin librerías de animación pesadas**: usar CSS transitions + Tailwind
- **Build**: `npm run build` + `npm run lint` deben pasar sin errores al finalizar

## Acceptance Criteria

- [ ] Un usuario puede ejecutar Python en el browser sin instalar nada
- [ ] Los tests del challenge se evalúan en el browser y el resultado se muestra en tiempo real
- [ ] Al pasar un challenge → XP asignado → backend actualizado
- [ ] La XPBar en el layout muestra el XP real del usuario (no hardcodeado)
- [ ] Al subir de nivel → LevelUpModal aparece automáticamente
- [ ] `/profile` muestra badges, streak calendar y nivel real
- [ ] El tutor responde preguntas en el panel de chat con contexto del challenge
- [ ] `npm run build` y `npm run lint` pasan sin errores

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Pyodide bundle demasiado grande afecta Core Web Vitals | Alta | Medio | Lazy load + loading screen |
| Monaco SSR crash con Next.js App Router | Alta | Alto | `next/dynamic` con `ssr: false` siempre |
| Web Worker no disponible en build estático | Baja | Alto | Feature detect + fallback a main thread |
| CORS en fetch del tutor desde browser | Baja | Medio | Backend ya tiene CORS configurado |
