# Testing: Fase 1B — MDX Content + Components

## Verify Feature Is Active

```bash
cd frontend && npm run dev
# Navegar a http://localhost:3000/modules → lista de módulos
# Navegar a http://localhost:3000/modules/module-0 → 5 lecciones
# Navegar a http://localhost:3000/modules/module-0/00-bienvenida → lección renderizada
```

## Main Test Cases

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 1 | `/modules` autenticado | GET | Grid con módulos 0-5 (con contenido) y 6+ (Próximamente + Lock) |
| 2 | `/modules/module-0` | GET | Lista de 5 lecciones con título, descripción, tiempo y XP |
| 3 | `/modules/module-0/00-bienvenida` | GET | Lección renderizada: h1, Steps, Callout tip, Quiz, ProgressBar |
| 4 | Quiz sin responder | Ver lección | Muestra 4 opciones, ninguna seleccionada |
| 5 | Quiz — respuesta correcta | Click opción correcta | Verde, check icon, "Correcto!" |
| 6 | Quiz — respuesta incorrecta | Click opción incorrecta | Rojo, X icon, correcta marcada en verde |
| 7 | Quiz — no permite cambiar | Click tras responder | Botones disabled, estado no cambia |
| 8 | LessonSidebar | Ver lección | Lista de lecciones del módulo, activa destacada en morado |
| 9 | LessonNav — primera lección | Ver 00-bienvenida | Solo botón "Next →", sin "← Prev" |
| 10 | LessonNav — última lección | Ver 04-primer-mensaje | Solo "← Prev", sin "Next →" |
| 11 | LessonNav — lección media | Ver 02-docker-setup | Ambos botones presentes |
| 12 | CompleteButton | Click "Marcar como completada" | Loading spinner → "Lección completada ✓ +50 XP" |
| 13 | Syntax highlighting | Ver lección con código Python | Bloques con fondo oscuro y colores |
| 14 | Callout variants | Ver lecciones con Callout | info=azul, warning=amarillo, error=rojo, tip=verde |
| 15 | Build estático | `npm run build` | 30 páginas generadas, 0 errores |

## Edge Cases & Validations

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | Lección inexistente `/modules/module-0/99-fake` | 404 Not Found |
| 2 | Módulo inexistente `/modules/module-99` | 404 Not Found |
| 3 | Módulo sin contenido (ej. module-3) | Página de módulo muestra "Contenido próximamente" |
| 4 | CompleteButton sin sesión | API retorna 403, botón muestra done silenciosamente |
| 5 | MDX con código Python largo | Scroll horizontal en el bloque, no overflow del layout |

## Verify in Logs

```bash
# Build exitoso
✓ Generating static pages (30/30)
# Todas las rutas deben aparecer en el output

# Dev — carga de lección
# Network: /modules/module-0/00-bienvenida → 200, HTML pre-renderizado
# Sin requests a APIs externas para el contenido (filesystem)
```

## Componentes MDX — Verificación Visual

```
Callout info    → border-blue, fondo azul tenue, icono Info
Callout warning → border-yellow, fondo amarillo tenue, icono AlertTriangle
Callout error   → border-red, fondo rojo tenue, icono XCircle
Callout tip     → border-green, fondo verde tenue, icono Lightbulb
Terminal        → fondo zinc-950, texto emerald-400, barra superior gris
Step            → círculo morado con número, título bold, contenido gris
Concept         → chip morado, definición en gris
Highlight       → fondo semitransparente por color (yellow/purple/cyan/green)
ProgressBar     → barra morada sobre fondo gris, label + porcentaje
Quiz            → card con radio buttons → feedback inmediato con color
```

## Graceful Degradation

- Si `content/modules/` no existe: `getLessonList` retorna `[]`, módulo muestra "Próximamente"
- Si falta frontmatter en MDX: valores default (`xpReward=50`, `title=slug`, `description=""`)
- Si `CompleteButton` falla la llamada al backend: marca como done localmente sin XP

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Build falla con "Cannot read .map" | `options` en Quiz es array de objetos en MDX | Usar string array: `options={["A", "B"]}` + `correct={N}` |
| Build falla con ".split is not a function" | FileTree usando `children` en lugar de `paths` prop | Cambiar a `<FileTree paths="..." />` |
| Build falla con "trim undefined" | `<CodeBlock code={`...`} />` con XML tags o `{vars}` en template literal | Reemplazar por fenced code block estándar ` ```python ` |
| Syntax highlighting no aparece | `@shikijs/rehype` no configurado en MDXRemote | Verificar `options={MDX_OPTIONS}` en lesson page |
| Lección no aparece en `/modules/moduleId` | Archivo .mdx no sigue el patrón `NN-slug.mdx` | Nombre debe comenzar con dígitos para el sort |
