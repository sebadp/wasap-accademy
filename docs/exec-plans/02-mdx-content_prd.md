# PRD — Fase 1B: MDX Content + Components

## Objetivo

Construir el sistema de contenido interactivo de AgentCraft: los componentes MDX reutilizables, el content loader, las páginas de módulo/lección, y el contenido de las primeras 3 módulos (0, 1, 2).

## Scope

### In scope
- 10 componentes MDX custom (Callout, CodeBlock, Quiz, etc.)
- Content loader que parsea MDX desde `/content/modules/`
- Páginas Next.js para módulos (`/modules/[module]`) y lecciones (`/modules/[module]/[lesson]`)
- Sidebar de navegación de lecciones dentro de un módulo (`LessonSidebar`)
- Contenido MDX del Módulo 0 (5 lecciones), Módulo 1 (5 lecciones), Módulo 2 (5 lecciones)
- Integración con el backend: marcar lecciones como completadas, mostrar progreso

### Out of scope
- Pyodide / CodeEditor (Fase 1C)
- AI tutor (Fase 1C)
- Gamification UI (Fase 1C)
- Módulos 3-16 (Fase 2)

## Use Cases

1. **UC1 – Estudiante navega a un módulo**: Ve la lista de lecciones con estado (locked/available/completed), progreso y XP estimado.
2. **UC2 – Estudiante lee una lección**: Ve contenido MDX renderizado con componentes interactivos (callouts, code blocks con syntax highlighting, quizzes).
3. **UC3 – Estudiante completa una lección**: Click en "Marcar como completada" → API POST → XP asignado → siguiente lección desbloqueada.
4. **UC4 – Estudiante navega entre lecciones**: Sidebar de lección activa, botones prev/next.
5. **UC5 – Estudiante ve su progreso**: Barra de progreso por módulo en el Skill Tree.

## Constraints

- MDX debe ser cargado en el servidor (Next.js Server Components) para SEO
- Sin instalar Monaco ni Pyodide en esta fase
- Syntax highlighting debe funcionar sin JS en cliente (Shiki o similar)
- El contenido de las lecciones debe estar en `frontend/content/modules/` como archivos `.mdx`

## Acceptance Criteria

- [ ] Las 10 lecciones del Módulo 0, 1 y 2 renderizan correctamente
- [ ] Los componentes MDX son reutilizables y funcionan en cualquier lección
- [ ] Marcar lección como completada actualiza el progreso en el backend
- [ ] El Skill Tree muestra porcentaje de progreso por módulo
- [ ] `npm run build` y `npm run lint` pasan sin errores
