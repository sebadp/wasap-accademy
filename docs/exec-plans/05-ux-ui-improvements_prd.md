# PRD — Fase 5: UX/UI Improvements (Auditoría Senior)

## Objetivo

Elevar la calidad UX/UI de AgentCraft Academy de 7.2/10 a 8.5+/10, resolviendo problemas críticos de mobile experience, mejorando la visualización de progreso en gamificación, cumpliendo WCAG 2.1 AA, y adoptando tendencias UX 2026 para plataformas EdTech gamificadas.

## Contexto

Auditoría UX/UI Senior realizada el 2026-03-17, complementada con investigación de tendencias 2026 y skills especializados (ui-design-review, gamification-loops, accessibility-audit, growth-design-review). La plataforma tiene fundamentos sólidos pero gaps críticos en mobile y accesibilidad.

## Scope

### In scope

**P0 — Critical (Mobile & Core UX)**
- Mobile navigation: hamburger menu + drawer/sheet para sidebar
- Challenge runner responsive: stack vertical en mobile
- Touch targets: mínimo 44x44px en todos los elementos interactivos

**P1 — High Priority (Gamification & A11y)**
- Skill tree con overlay de progreso (completado/en-progreso/bloqueado)
- Near-badge progress indicators (anillos de progreso)
- `prefers-reduced-motion` en todas las animaciones
- `aria-label` en badges, emojis y elementos interactivos
- Tooltips en locked lessons (razón del bloqueo)
- Avatar personalizable (iniciales del usuario)

**P2 — Medium Priority (Engagement & Polish)**
- Celebraciones mejoradas (confetti en tier completion, animación en module completion)
- Tooltips en XP bar (desglose hover)
- Freeze tokens visibles en UI del streak
- Leaderboard: mejor diferenciación visual para ranks 4+
- Quiz component: accesibilidad con `role="radiogroup"`

**P3 — Long-term (Tendencias 2026)**
- Ruta personalizada / módulo recomendado ("Siguiente paso sugerido")
- Resumen semanal de progreso
- Dark/Light theme toggle
- View Transitions API entre páginas

### Out of scope
- Social features (comments, messaging)
- Offline mode / PWA
- Mobile native app (iOS/Android)
- Redesign completo de branding
- Backend changes (solo frontend UI)

## Use Cases

1. **UC1 – Estudiante en mobile navega la plataforma**:
   Abre la app en su celular, ve un hamburger icon en el navbar, lo toca y aparece un drawer con las 4 secciones (Skill Tree, Módulos, Ranking, Perfil) + streak indicator. Toca "Módulos" y el drawer se cierra.

2. **UC2 – Estudiante ve progreso en el Skill Tree**:
   Entra a `/map`, ve que los módulos completados brillan con checkmark, el módulo actual pulsa con animación, y los pendientes están con opacity baja + candado. Las líneas de conexión se "encienden" conforme avanza.

3. **UC3 – Estudiante casi desbloquea un badge**:
   En `/profile`, ve un badge con un anillo de progreso al 80% y texto "Completa 1 challenge más para desbloquear 🔥". Le motiva a seguir.

4. **UC4 – Estudiante completa un tier completo**:
   Termina el último módulo del tier "Foundation". Aparece una pantalla de celebración con confetti, el nombre del tier, XP total ganado en ese tier, y un CTA "Comenzar siguiente tier".

5. **UC5 – Estudiante con vestibular disorder**:
   Tiene `prefers-reduced-motion: reduce` en su OS. Las animaciones de pulse, bounce y zoom se desactivan automáticamente. Los skill tree nodes no pulsan. El level-up modal aparece sin animación de zoom.

6. **UC6 – Screen reader en badges**:
   Un usuario con screen reader navega los badges. Cada badge tiene `aria-label="Badge: Primera Sangre - Completa tu primer challenge. Estado: Desbloqueado"`.

7. **UC7 – Estudiante hace challenge en mobile**:
   Abre un challenge en su celular. Ve el editor de código arriba (70% del viewport), y abajo las tabs Output/Tests. Puede scrollear el editor. Hace tap en "Ejecutar" y los resultados aparecen abajo.

## Constraints

- **Sin librerías pesadas**: no Framer Motion (>30KB). Usar CSS animations + Tailwind animate
- **Sin backend changes**: todas las mejoras son frontend-only
- **Build**: `npm run build` + `npm run lint` deben pasar sin errores
- **Performance**: no degradar Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- **Retrocompatibilidad**: no romper funcionalidad existente
- **Confetti**: usar canvas-confetti (~6KB gzip) o CSS-only
- **Theme toggle**: usar CSS custom properties ya existentes en globals.css

## Acceptance Criteria

### P0 — Critical
- [ ] En viewport < 768px, el sidebar se colapsa y aparece un hamburger menu
- [ ] El drawer mobile muestra las 4 secciones + streak + XP bar
- [ ] El challenge runner stack vertical en mobile (editor arriba, output abajo)
- [ ] Todos los touch targets son >= 44x44px (skill tree nodes, buttons, nav items)

### P1 — High Priority
- [ ] Skill tree muestra 3 estados visuales: completado (glow + check), actual (pulse), bloqueado (dim + lock)
- [ ] Badges con progress ring muestran % de completitud para badges cercanos
- [ ] Todas las animaciones respetan `prefers-reduced-motion: reduce`
- [ ] Todos los badges tienen `aria-label` descriptivo con nombre, descripción y estado
- [ ] Locked lessons muestran tooltip con razón del bloqueo al hover/focus
- [ ] Avatar muestra iniciales del usuario en lugar de "?"

### P2 — Medium Priority
- [ ] Completar un tier muestra celebración con confetti
- [ ] XP bar tiene tooltip con desglose (Level, XP actual, XP para siguiente nivel)
- [ ] Freeze tokens visibles junto al streak en sidebar
- [ ] Leaderboard ranks 4+ tienen mejor diferenciación visual
- [ ] Quiz options usan `role="radiogroup"` con `aria-checked`

### P3 — Long-term
- [ ] Dashboard muestra "Siguiente módulo recomendado"
- [ ] Dark/Light toggle funcional
- [ ] View Transitions API entre páginas (con fallback graceful)

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Mobile drawer rompe layout existente | Media | Alto | Implementar con portal/overlay, no tocar sidebar actual |
| Confetti afecta performance en mobile | Baja | Medio | canvas-confetti con autoRemove, max 150 partículas |
| prefers-reduced-motion rompe UX | Baja | Medio | Testear cada animación que se desactiva tiene alternativa estática |
| Theme toggle causa flash al cargar | Media | Medio | Script inline en `<head>` para detectar tema antes del render |
| Progress overlay en skill tree complejiza el SVG | Media | Medio | Usar data attributes + CSS, no reescribir lógica SVG |
| View Transitions API soporte limitado | Alta | Bajo | Feature detection + fallback a navegación normal |

## Métricas de Éxito

| Métrica | Actual | Target |
|---------|--------|--------|
| Score UX/UI | 7.2/10 | 8.5+/10 |
| Mobile usability (Lighthouse) | No medido | 90+ |
| Accessibility (Lighthouse) | No medido | 90+ |
| Touch target compliance | ~60% | 100% |
| WCAG 2.1 AA compliance | Parcial | Completo |
