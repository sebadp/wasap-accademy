# Feature: Fase 1B — MDX Content + Components

## What It Does

Sistema completo de contenido interactivo: 9 componentes MDX reutilizables, un content loader server-side, páginas de módulo y lección con syntax highlighting, y 15 lecciones reales distribuidas en 3 módulos de la Fase Foundation.

## Architecture

```
content/modules/                     ← MDX files (filesystem)
  module-0/  (5 lecciones)
  module-1/  (5 lecciones)
  module-2/  (5 lecciones)
      ↓
src/lib/content/loader.ts            ← gray-matter + reading-time
      ↓
app/(academy)/modules/[moduleId]/[lessonId]/page.tsx
      ↓
MDXRemote (next-mdx-remote/rsc)
  + @shikijs/rehype                  ← syntax highlighting server-side
  + getMDXComponents()               ← 9 custom components
      ↓
Browser (zero JS para código highlight)
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/lib/content/types.ts` | LessonMeta, ModuleMeta, LessonContent |
| `frontend/src/lib/content/loader.ts` | getModuleList(), getLessonList(), getLessonContent() |
| `frontend/src/components/mdx/` | 9 componentes MDX |
| `frontend/src/components/mdx/MDXComponents.tsx` | Mapa de componentes para next-mdx-remote |
| `frontend/src/components/mdx/Quiz.tsx` | Quiz interactivo (client component) |
| `frontend/src/components/mdx/Callout.tsx` | info/warning/error/tip |
| `frontend/src/components/mdx/FileTree.tsx` | Árbol de archivos (prop `paths`) |
| `frontend/src/components/navigation/LessonSidebar.tsx` | Lista de lecciones con estado |
| `frontend/src/components/navigation/LessonNav.tsx` | Botones prev/next |
| `frontend/src/components/lesson/CompleteButton.tsx` | Marcar lección → POST backend |
| `frontend/src/app/(academy)/modules/page.tsx` | Lista de módulos |
| `frontend/src/app/(academy)/modules/[moduleId]/page.tsx` | Detalle de módulo |
| `frontend/src/app/(academy)/modules/[moduleId]/[lessonId]/page.tsx` | Lección renderizada |
| `frontend/content/modules/module-{0,1,2}/` | 15 archivos .mdx |

## Technical Walkthrough

### Step 1: Content loading (server-side)
1. `getLessonContent(moduleId, lessonId)` lee el `.mdx` del filesystem
2. `gray-matter` extrae frontmatter (title, description, xpReward)
3. `reading-time` calcula minutos de lectura
4. Se retorna el body MDX limpio (sin frontmatter)

### Step 2: MDX rendering
1. `MDXRemote` de `next-mdx-remote/rsc` compila el MDX source
2. `@shikijs/rehype` como plugin rehype aplica syntax highlighting a code blocks
3. `getMDXComponents()` inyecta los 9 custom components y overrides de HTML
4. Todo ocurre en el servidor — zero JS de highlighting en el cliente

### Step 3: Interactividad client-side
- `Quiz` es el único `"use client"` component — estado local de respuesta seleccionada
- `CompleteButton` es `"use client"` — llama al backend y muestra XP ganado
- Todo lo demás es Server Component

## Design Decisions

| Decision | Alternative Discarded | Reason |
|----------|----------------------|--------|
| `next-mdx-remote/rsc` | `@next/mdx` (built-in) | Más flexible, soporte RSC, no requiere webpack config |
| `@shikijs/rehype` plugin | `<CodeBlock async>` custom | Code blocks en MDX con JSX props rompen el parser (angle brackets, curly braces) |
| Fenced code blocks estándar | `<CodeBlock code={`...`} />` | Template literals en JSX props en MDX son frágiles |
| `paths` prop en FileTree | `children` string | MDX wrappea el contenido entre tags como React nodes, no string |
| `options` como string[] + `correct` number | `options=[{label, correct: true}]` | Objetos complejos en arrays JSX en MDX pueden fallar el parser |
| Filesystem + `generateStaticParams` | CMS / DB | Zero latencia, deploy estático, sin dependencias externas |

## Gotchas & Edge Cases

- **MDX parsing**: nunca usar template literals (`\`...\``) como valores de props JSX en MDX si el contenido tiene `<tags>` o `{vars}` — el parser falla silenciosamente
- **FileTree**: acepta `paths` como string, NO `children` (MDX wrappea en React nodes)
- **Quiz**: `options` debe ser string array, `correct` es índice numérico 0-based
- **Shiki theme**: `github-dark` — si se cambia, actualizar también el CSS wrapper en MDXComponents
- **Frontmatter**: `xpReward` default es 50 si no se especifica en el MDX

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CONTENT_DIR` | `process.cwd()/content/modules` | Path al directorio de MDX |
| `xpReward` (frontmatter) | `50` | XP por completar la lección |
| Shiki theme | `github-dark` | Tema de syntax highlighting |
