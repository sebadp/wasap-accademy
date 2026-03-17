# PRD — Expansión Curricular AgentCraft v2

> **Fecha**: 2026-03-15
> **Autor**: Equipo AgentCraft
> **Estado**: Draft → En ejecución

## 1. Contexto

AgentCraft v1 tiene 3 módulos (15 lecciones) de 17 planeados. La plataforma de gamificación (XP, badges, streaks, challenges, tutor AI) está completa. LocalForge ha crecido a **17 subsistemas**, **49 features documentadas** y **50+ tablas SQLite**, lo cual ofrece material didáctico rico para una currícula mucho más extensa.

## 2. Objetivo

Expandir la currícula de 3 a **23 módulos** (~115 lecciones), cubriendo **todos los subsistemas de LocalForge**, organizados en 7 tiers de complejidad progresiva con material didáctico completo: explicaciones conceptuales, código real, quizzes interactivos, y coding challenges.

## 3. Principios Pedagógicos (Best Practices 2026)

| Principio | Implementación |
|-----------|---------------|
| **Aprendizaje basado en proyecto real** | Todo el contenido usa código de WasAP/LocalForge — nunca ejemplos de juguete |
| **Complejidad progresiva (scaffolding)** | 7 tiers: Foundation → Core → Intermediate → Advanced → Expert → Specialist → Production |
| **Competency-based progression** | Cada módulo tiene prerequisitos explícitos y assessment gates |
| **Hands-on desde el día 1** | Cada lección incluye código interactivo, quizzes, y al menos un ejercicio práctico |
| **Retrieval practice** | Quizzes al final de cada lección, challenges al final de cada tier |
| **Spaced repetition** | Módulos avanzados referencian y refuerzan conceptos de módulos anteriores |
| **Production mindset** | Se enseña el "por qué" junto al "cómo" — trade-offs, decisiones arquitectónicas |
| **AI-assisted learning** | Tutor AI disponible en cada lección con contexto del módulo actual |
| **Multiple assessment types** | Quizzes (conceptual), challenges (código), code reviews (análisis), architecture exercises (diseño) |
| **Real-world patterns** | Async/await, dependency injection, Protocol pattern, Registry, best-effort I/O, etc. |

## 4. Público Objetivo

- **Nivel base**: Desarrolladores Python con conocimientos básicos (funciones, clases, async/await conceptual)
- **Nivel de salida**: Capaz de diseñar, implementar y operar un sistema AI agentic de producción
- **Perfil**: Backend developers, ML engineers aprendiendo infra, full-stack developers explorando AI

## 5. Estructura Curricular — 23 Módulos en 7 Tiers

### Tier 1: Foundation (Módulos 0-2) — EXISTENTE
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 0 | Setup & Onboarding | 5 | 175 |
| 1 | Webhook Pipeline | 5 | 275 |
| 2 | LLM Integration | 5 | 275 |

### Tier 2: Core (Módulos 3-6) — NUEVO
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 3 | Database & Persistence | 5 | 325 |
| 4 | Conversation & State | 5 | 325 |
| 5 | Memory System | 5 | 375 |
| 6 | Skills Framework | 5 | 375 |

### Tier 3: Intermediate (Módulos 7-10) — NUEVO
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 7 | Tool Calling & Execution | 5 | 375 |
| 8 | Intent Classification & Routing | 5 | 375 |
| 9 | Semantic Search & RAG | 5 | 425 |
| 10 | Context Engineering | 5 | 425 |

### Tier 4: Advanced (Módulos 11-14) — NUEVO
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 11 | Multimedia Processing | 5 | 375 |
| 12 | Guardrails & Quality Control | 5 | 425 |
| 13 | Tracing & Observability | 5 | 425 |
| 14 | Evaluation & Self-Improvement | 5 | 475 |

### Tier 5: Expert — Agent Mode (Módulos 15-17) — NUEVO
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 15 | Agent Sessions & Reactive Loop | 5 | 475 |
| 16 | Planner-Orchestrator | 5 | 525 |
| 17 | Agentic Security & HITL | 5 | 475 |

### Tier 6: Specialist (Módulos 18-20) — NUEVO
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 18 | Multi-Platform & MCP | 5 | 475 |
| 19 | Knowledge Graphs & Provenance | 5 | 475 |
| 20 | Operational Automation | 5 | 425 |

### Tier 7: Production (Módulos 21-22) — NUEVO
| Módulo | Tema | Lecciones | XP Total |
|--------|------|-----------|----------|
| 21 | Performance Optimization | 5 | 475 |
| 22 | Production Deploy & CI/CD | 5 | 525 |

**Total: 23 módulos, 115 lecciones, ~9,200 XP disponible**

## 6. Desafíos por Tier

Cada Tier (excepto Foundation que ya tiene challenges) incluye un **Tier Challenge** sumativo:

| Tier | Challenge | XP |
|------|-----------|-----|
| Core | Build a working memory + CRUD commands | 400 |
| Intermediate | Implement a skill with tool calling + routing | 500 |
| Advanced | Create a guardrail + wire it to tracing | 500 |
| Expert | Implement a reactive agent loop with security | 600 |
| Specialist | Add Telegram support with PlatformClient | 500 |
| Production | Optimize a slow path + add CI pipeline | 600 |

## 7. Actualización de Módulo 0 (Bienvenida)

Actualizar la lección 00-bienvenida.mdx para reflejar 23 módulos en 7 tiers en vez de 17 módulos en 4 tiers.

## 8. Métricas de Éxito

- **Completion rate** > 60% por módulo (los primeros 10 módulos)
- **Challenge pass rate** > 40% en primer intento
- **Daily active learners** con streak > 3 días: > 30%
- **Tutor usage** < 5 preguntas promedio por challenge

## 9. Fuera de Alcance

- Traducciones a otros idiomas (todo en español con términos técnicos en inglés)
- Video content (solo texto + código interactivo)
- Certificaciones formales
- Social features (leaderboard ya existe, no se expande)

## 10. Dependencias

- LocalForge codebase como referencia canónica
- Pyodide para challenges en browser
- MDX components existentes (no se crean nuevos)
- Backend gamification ya funcional

## 11. Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Volumen de contenido muy alto (100 lecciones nuevas) | Crear por tiers, release incremental |
| LocalForge evoluciona y rompe referencias | Usar patrones genéricos + links a archivos específicos |
| Challenges demasiado difíciles | Difficulty rating + hints progresivos |
| Módulos avanzados sin audiencia | Track system — los specialist son opcionales |
