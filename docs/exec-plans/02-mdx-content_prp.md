# PRP — Fase 1B: MDX Content + Components

## Files to Create / Modify

### Dependencies
```
frontend/package.json  ← add: next-mdx-remote, shiki, gray-matter, reading-time
```

### Content (MDX files)
```
frontend/content/modules/
  module-0/
    00-bienvenida.mdx
    01-estructura-proyecto.mdx
    02-docker-setup.mdx
    03-entorno-local.mdx
    04-primer-mensaje.mdx
  module-1/
    00-intro-webhooks.mdx
    01-anatomia-webhook.mdx
    02-verificacion-whatsapp.mdx
    03-parsear-mensajes.mdx
    04-responder-mensajes.mdx
  module-2/
    00-intro-llms.mdx
    01-anthropic-sdk.mdx
    02-prompt-engineering.mdx
    03-structured-output.mdx
    04-manejo-errores.mdx
```

### Content Loader
```
frontend/src/lib/content/
  loader.ts        ← parsea MDX del filesystem, extrae frontmatter
  types.ts         ← tipos: LessonMeta, ModuleMeta, LessonContent
```

### MDX Components (10)
```
frontend/src/components/mdx/
  Callout.tsx       ← info/warning/error/tip con iconos
  CodeBlock.tsx     ← syntax highlighting con Shiki (server)
  Quiz.tsx          ← quiz interactivo client-side (radio buttons)
  Step.tsx          ← paso numerado para instrucciones
  FileTree.tsx      ← árbol de archivos visual
  Highlight.tsx     ← texto resaltado inline
  Terminal.tsx      ← bloque estilo terminal (fondo negro, prompt $)
  Concept.tsx       ← definición de concepto con término + descripción
  Progress.tsx      ← barra de progreso visual
  MDXComponents.tsx ← mapa de componentes para next-mdx-remote
```

### Pages
```
frontend/src/app/(academy)/
  modules/
    page.tsx                    ← lista de todos los módulos
    [moduleId]/
      page.tsx                  ← detalle módulo: lista de lecciones
      [lessonId]/
        page.tsx                ← lección MDX renderizada
```

### Navigation Components
```
frontend/src/components/navigation/
  LessonSidebar.tsx   ← lista de lecciones del módulo activo (con estado)
  LessonNav.tsx       ← botones prev/next al pie de la lección
```

### Hooks
```
frontend/src/hooks/
  useProgress.ts   ← fetch del progreso del usuario (SWR o React Query ligero)
```

---

## Phases

### Phase 1 — Instalar dependencias y content loader
- [ ] Instalar `next-mdx-remote`, `shiki`, `gray-matter`, `reading-time`
- [ ] Crear `src/lib/content/types.ts` con tipos LessonMeta, ModuleMeta, LessonContent
- [ ] Crear `src/lib/content/loader.ts`:
  - `getModuleList()` → lista de módulos con metadata
  - `getLessonList(moduleId)` → lista de lecciones de un módulo
  - `getLessonContent(moduleId, lessonId)` → frontmatter + MDX source

### Phase 2 — Componentes MDX
- [ ] `Callout.tsx` — variantes: info (azul), warning (amarillo), error (rojo), tip (verde)
- [ ] `CodeBlock.tsx` — recibe `lang` y `code`, usa Shiki para highlighting en servidor
- [ ] `Terminal.tsx` — pre estilo terminal con fondo negro y texto verde
- [ ] `Step.tsx` — paso numerado, children como contenido
- [ ] `FileTree.tsx` — árbol de archivos con indentación visual
- [ ] `Highlight.tsx` — span con fondo amarillo/morado inline
- [ ] `Concept.tsx` — tarjeta con término en bold + definición
- [ ] `Quiz.tsx` — radio buttons, opción correcta, feedback inmediato (client)
- [ ] `Progress.tsx` — barra de progreso (width % en CSS)
- [ ] `MDXComponents.tsx` — mapa de todos los componentes para next-mdx-remote

### Phase 3 — Páginas de módulo y lección
- [ ] `/modules/page.tsx` — grid de módulos con progreso
- [ ] `/modules/[moduleId]/page.tsx` — lista de lecciones con estado locked/available/completed
- [ ] `/modules/[moduleId]/[lessonId]/page.tsx`:
  - Cargar MDX con `next-mdx-remote`
  - Renderizar con MDXComponents
  - LessonSidebar izquierda, LessonNav abajo
  - Botón "Marcar como completada" → POST /api/progress/complete

### Phase 4 — Contenido MDX: Módulo 0
- [ ] `00-bienvenida.mdx` — intro a AgentCraft y WasAP
- [ ] `01-estructura-proyecto.mdx` — FileTree de WasAP, arquitectura
- [ ] `02-docker-setup.mdx` — Docker compose, servicios
- [ ] `03-entorno-local.mdx` — .env, instalación, primer `make dev`
- [ ] `04-primer-mensaje.mdx` — flow completo de un mensaje WhatsApp

### Phase 5 — Contenido MDX: Módulos 1 y 2
- [ ] Módulo 1 (5 lecciones): Webhook Pipeline
- [ ] Módulo 2 (5 lecciones): LLM Integration

### Phase 6 — Integración progreso + sidebar actualizado
- [ ] `useProgress.ts` hook con fetch del backend
- [ ] `LessonSidebar.tsx` con estado real (locked/available/completed)
- [ ] `LessonNav.tsx` prev/next navegación
- [ ] Skill Tree muestra % progreso por módulo

### Phase 7 — QA
- [ ] `npm run build` sin errores
- [ ] `npm run lint` sin warnings
- [ ] Navegación completa: landing → login → /map → /modules → lección → completar → XP

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| MDX library | `next-mdx-remote` v5 | Compatible con App Router, server components |
| Syntax highlighting | `shiki` | Server-side, zero JS bundle, soporte de temas |
| Frontmatter parsing | `gray-matter` | Estándar, simple, funciona con FS |
| Data fetching | `fetch` directo (no SWR) | Sin dependencias extra por ahora |
| Content location | `frontend/content/` | Separado de `src/`, fácil de editar |
