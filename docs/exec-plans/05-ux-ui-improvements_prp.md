# PRP — Fase 5: UX/UI Improvements (Implementation Plan)

## Fase 5A: P0 — Mobile & Core UX ✅

### 5A.1 — Mobile Navigation (Hamburger + Drawer) ✅

**Archivos creados:**
- `frontend/src/components/navigation/MobileDrawer.tsx` — Drawer overlay con animación slide-in

**Archivos modificados:**
- `frontend/src/components/navigation/Navbar.tsx` — Hamburger button (md:hidden) + drawer state
- `frontend/src/components/navigation/Sidebar.tsx` — `hidden md:flex` para ocultar en mobile
- `frontend/src/app/(academy)/layout.tsx` — `ml-0 md:ml-56` responsive padding

**Checklist:**
- [x] Crear componente `MobileDrawer` con:
  - Backdrop overlay (bg-black/50, click-to-close)
  - Panel lateral (w-72, slide-in desde izquierda)
  - Mismo contenido que Sidebar (4 nav items + streak + phase badge)
  - Botón de cerrar (X icon) con 44x44px touch target
  - Body scroll lock cuando abierto
  - ARIA attributes (role="dialog", aria-modal="true")
  - Auto-close on pathname change
- [x] Agregar hamburger icon (Menu de lucide-react) al Navbar, visible solo en `md:hidden`
- [x] Sidebar: agregar `hidden md:flex` al contenedor principal
- [x] Layout: responsive margin `ml-0 md:ml-56` y padding `p-4 md:p-6`
- [x] `npm run build && npm run lint` pasa

### 5A.2 — Challenge Runner Responsive ✅

**Archivos modificados:**
- `frontend/src/components/editor/SplitPane.tsx` — flex-col md:flex-row
- `frontend/src/components/challenge/ChallengeRunner.tsx` — sticky buttons, touch targets

**Checklist:**
- [x] SplitPane: `flex-col md:flex-row` con responsive widths
- [x] Mobile: editor min-h-[50vh], output min-h-[40vh]
- [x] Desktop: mantener split 50/50 actual
- [x] Border responsive: `border-b md:border-b-0 md:border-r`
- [x] Botones Run/Submit: sticky bottom en mobile, min-h-[44px]
- [x] `npm run build && npm run lint` pasa

### 5A.3 — Touch Targets ✅

**Checklist:**
- [x] Sidebar nav items: min-h-[44px]
- [x] MobileDrawer nav items: min-h-[44px]
- [x] Navbar hamburger + close: h-11 w-11 (44x44px)
- [x] ChallengeRunner buttons: min-h-[44px]
- [x] `npm run build && npm run lint` pasa

---

## Fase 5B: P1 — Gamification & Accessibility ✅

### 5B.1 — Skill Tree Progress Overlay ✅

**Archivos creados:**
- `frontend/src/components/gamification/SkillTreeClient.tsx` — Client wrapper con progress overlay

**Archivos modificados:**
- `frontend/src/app/(academy)/map/page.tsx` — Server component pasa modules a SkillTreeClient
- `frontend/src/app/globals.css` — Animación skill-node-current

**Checklist:**
- [x] Fetch progreso del usuario (useProgress hook)
- [x] Nodos completados: tier color fill + checkmark SVG + glow filter
- [x] Nodo actual (primer no-completado): doble anillo animated pulse
- [x] Nodos futuros: opacity 0.3 + fill gris + lock icon SVG
- [x] Líneas de conexión completadas: strokeOpacity 0.6, más gruesas
- [x] Líneas futuras: opacity 0.15
- [x] Legend actualizada con estados (Completado / En progreso / Pendiente)
- [x] `npm run build && npm run lint` pasa

### 5B.2 — Near-Badge Progress Indicators ⏸️ (deferred)

> Depende de que el backend exponga progreso parcial por badge. API actual solo retorna awarded_at.
> Se puede implementar cuando el backend agregue `progress: number` al Badge type.

### 5B.3 — Accessibility Compliance ✅

**Archivos modificados:**
- `frontend/src/app/globals.css` — `prefers-reduced-motion: reduce` media query
- `frontend/src/components/gamification/BadgeGrid.tsx` — aria-labels + role="img" + grid responsive
- `frontend/src/components/gamification/LevelUpModal.tsx` — role="dialog" + aria-modal + Escape key + min-h-[44px]
- `frontend/src/components/mdx/Quiz.tsx` — role="radiogroup" + role="radio" + aria-checked + min-h-[44px]
- `frontend/src/components/navigation/LessonSidebar.tsx` — locked lesson tooltips + aria-disabled + tabIndex

**Checklist:**
- [x] `prefers-reduced-motion: reduce` desactiva todas las animaciones/transiciones
- [x] BadgeGrid: aria-label con nombre, descripción y estado
- [x] LevelUpModal: role="dialog", aria-modal, aria-labelledby, Escape handler
- [x] Quiz: role="radiogroup" + role="radio" + aria-checked
- [x] Locked lessons: title tooltip "Completá X para desbloquear"
- [x] Locked lessons: aria-disabled="true" + tabIndex={-1}
- [x] `npm run build && npm run lint` pasa

### 5B.4 — Avatar Personalizable ✅

**Archivos modificados:**
- `frontend/src/app/(academy)/profile/page.tsx` — User initials from Supabase auth

**Checklist:**
- [x] Extraer iniciales del nombre/email del usuario
- [x] Renderizar iniciales en círculo bg-primary/20
- [x] Fallback "?" si no hay nombre
- [x] `npm run build && npm run lint` pasa

---

## Fase 5C: P2 — Engagement & Polish ✅

### 5C.1 — "Continue Where You Left Off" ✅

**Archivos creados:**
- `frontend/src/components/gamification/ContinueCard.tsx` — Card destacada con próximo módulo

**Archivos modificados:**
- `frontend/src/app/(academy)/modules/page.tsx` — Integra ContinueCard arriba del listado

**Checklist:**
- [x] useProgress() para encontrar primer módulo incompleto
- [x] Card destacada con borde primary, título y CTA "Continuar"
- [x] Barra de progreso del módulo
- [x] Null cuando no hay datos o todo completado
- [x] `npm run build && npm run lint` pasa

### 5C.2 — UI Polish (Tooltips, Freeze, Leaderboard) ✅

**Archivos modificados:**
- `frontend/src/components/gamification/XPBar.tsx` — CSS-only tooltip hover con desglose
- `frontend/src/components/navigation/Sidebar.tsx` — Freeze tokens (🛡️) junto al streak
- `frontend/src/components/navigation/MobileDrawer.tsx` — Freeze tokens en mobile
- `frontend/src/app/(academy)/leaderboard/page.tsx` — Alternating rows + mini XP bars + position indicators

**Checklist:**
- [x] XPBar: hover tooltip "Nivel N · title" + "X/Y XP para nivel N+1"
- [x] Sidebar/MobileDrawer streak: freeze tokens "🛡️ xN" cuando > 0
- [x] Leaderboard ranks 4+: alternating bg + mini XP progress bar
- [x] `npm run build && npm run lint` pasa

---

## Fase 5D: P3 — Tendencias 2026 ✅

### 5D.1 — Dark/Light Theme Toggle ✅

**Archivos creados:**
- `frontend/src/components/navigation/ThemeToggle.tsx` — Sun/Moon toggle con useSyncExternalStore

**Archivos modificados:**
- `frontend/src/app/globals.css` — Light theme CSS custom properties + zinc override classes
- `frontend/src/app/layout.tsx` — Inline script para FOIT prevention + suppressHydrationWarning
- `frontend/src/components/navigation/Navbar.tsx` — ThemeToggle en header
- `frontend/src/app/page.tsx` — ThemeToggle en landing page header

**Checklist:**
- [x] CSS custom properties para light theme (data-theme="light")
- [x] Inline script en `<head>` para localStorage detection antes del render
- [x] Toggle Sun/Moon icon en navbar (useSyncExternalStore, no setState in effect)
- [x] Preferencia guardada en localStorage
- [x] Sin FOIT (Flash of Incorrect Theme)
- [x] Override classes para hardcoded bg-zinc-* en light theme
- [x] Code blocks mantienen tema oscuro en ambos temas (Shiki github-dark)
- [x] Toggle disponible en landing page y academia
- [x] `npm run build && npm run lint` pasa

### 5D.2 — View Transitions API ⏸️ (deferred)

> Next.js 15 no tiene soporte estable para View Transitions API.
> Se puede implementar cuando Next.js lo soporte nativamente o via experimental flag.

---

## Validación Final ✅

- [x] `cd frontend && npm run build` — sin errores
- [x] `cd frontend && npm run lint` — sin warnings/errores
- [ ] Testear en Chrome DevTools: 375px, 768px, 1280px
- [ ] Testear con `prefers-reduced-motion: reduce` activado
- [ ] Testear con screen reader (VoiceOver en macOS)
- [ ] Lighthouse: Performance > 85, Accessibility > 90

## Resumen de Archivos

### Archivos Creados (6)
1. `frontend/src/components/navigation/MobileDrawer.tsx`
2. `frontend/src/components/navigation/ThemeToggle.tsx`
3. `frontend/src/components/gamification/SkillTreeClient.tsx`
4. `frontend/src/components/gamification/ContinueCard.tsx`
5. `docs/exec-plans/05-ux-ui-improvements_prd.md`
6. `docs/exec-plans/05-ux-ui-improvements_prp.md`

### Archivos Modificados (16)
1. `frontend/src/app/globals.css` — Light theme, animations, reduced-motion, zinc overrides
2. `frontend/src/app/layout.tsx` — Theme detection script, suppressHydrationWarning
3. `frontend/src/app/page.tsx` — ThemeToggle en landing
4. `frontend/src/app/(academy)/layout.tsx` — Responsive margin/padding
5. `frontend/src/app/(academy)/map/page.tsx` — Server wrapper → SkillTreeClient
6. `frontend/src/app/(academy)/modules/page.tsx` — ContinueCard integration
7. `frontend/src/app/(academy)/profile/page.tsx` — User initials avatar
8. `frontend/src/app/(academy)/leaderboard/page.tsx` — Visual polish, mini XP bars
9. `frontend/src/components/navigation/Navbar.tsx` — Hamburger + ThemeToggle
10. `frontend/src/components/navigation/Sidebar.tsx` — Hidden mobile, freeze tokens, touch targets
11. `frontend/src/components/navigation/LessonSidebar.tsx` — Locked tooltips, aria-disabled
12. `frontend/src/components/editor/SplitPane.tsx` — Responsive stack
13. `frontend/src/components/challenge/ChallengeRunner.tsx` — Sticky buttons, touch targets
14. `frontend/src/components/gamification/XPBar.tsx` — Hover tooltip
15. `frontend/src/components/gamification/BadgeGrid.tsx` — Accessibility, responsive grid
16. `frontend/src/components/gamification/LevelUpModal.tsx` — Dialog a11y, Escape handler
17. `frontend/src/components/mdx/Quiz.tsx` — Radiogroup a11y, touch targets
18. `docs/exec-plans/README.md` — Index updated
