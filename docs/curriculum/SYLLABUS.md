# AgentCraft — Syllabus Completo v2

> **115 lecciones · 23 módulos · 7 tiers · ~9,275 XP**
> Última actualización: 2026-03-15

---

## Tier 1: Foundation — Cimientos

> **Prerequisitos**: Python básico (funciones, clases, imports)
> **Resultado**: Entender el flujo completo webhook → LLM → respuesta

### Módulo 0 — Setup & Onboarding ✅
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Bienvenido a AgentCraft | 25 | Filosofía, gamificación, estructura |
| 01 | Estructura del Proyecto | 50 | Árbol de directorios, capas, responsabilidades |
| 02 | Docker & Servicios | 50 | Docker Compose, Ollama, contenedores |
| 03 | Entorno Local | 25 | .env, venv, dependencias, Makefile |
| 04 | Tu Primer Mensaje | 25 | Flujo end-to-end: mensaje → respuesta |

### Módulo 1 — Webhook Pipeline ✅
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Intro a Webhooks | 50 | Push vs pull, HTTP callbacks, event-driven |
| 01 | Firma HMAC | 75 | SHA-256, `webhook/security.py`, verificación |
| 02 | Parsear el Payload | 50 | `webhook/parser.py`, tipos de mensaje |
| 03 | Responder Mensajes | 50 | WhatsApp Cloud API, `send_message()` |
| 04 | Testing del Webhook | 50 | `TestClient`, mocks, integration tests |

### Módulo 2 — LLM Integration ✅
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Intro a LLMs | 50 | Tokens, temperatura, modelos, Ollama |
| 01 | SDK de Anthropic/Ollama | 75 | `OllamaClient`, `chat()`, parámetros |
| 02 | Prompt Engineering Básico | 50 | System prompt, few-shot, instrucciones |
| 03 | Streaming de Respuestas | 50 | Chunks, async generators, UX |
| 04 | Integración Completa | 50 | Pipeline webhook → LLM → WhatsApp |

---

## Tier 2: Core — Infraestructura Esencial

> **Prerequisitos**: Tier 1 completado
> **Resultado**: App con persistencia, memoria, y capacidad de ejecutar herramientas

### Módulo 3 — Database & Persistence
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | SQLite Async con aiosqlite | 50 | `aiosqlite`, `check_same_thread=False`, PRAGMA tuning |
| 01 | Schema Design | 75 | 13 grupos de tablas, migrations, `init_db()` |
| 02 | Repository Pattern | 75 | `database/repository.py`, métodos CRUD async |
| 03 | Dedup Atómico | 50 | `processed_messages`, INSERT OR IGNORE, race conditions |
| 04 | Vector Storage con sqlite-vec | 75 | Extensión nativa, tablas virtuales `vec0`, `float[768]` |

**Conceptos clave**: async database, repository pattern, atomic operations, vector databases

### Módulo 4 — Conversation & State Management
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | ConversationManager | 50 | Wrapper async sobre Repository, lifecycle |
| 01 | Historial con Ventana | 75 | `get_windowed_history(verbatim_count=8)`, summarize_older |
| 02 | Summarizer Background | 75 | `conversation/summarizer.py`, background tasks, `BackgroundTasks` |
| 03 | Conversation State | 50 | `conversation_state` table, sticky categories, per-phone metadata |
| 04 | Compactación Inteligente | 75 | 3 niveles: JSON → LLM → truncate, `formatting/compaction.py` |

**Conceptos clave**: windowed history, background tasks, state management, data compaction

### Módulo 5 — Memory System
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Memorias Semánticas | 50 | `memories` table, CRUD, active/inactive lifecycle |
| 01 | Daily Logs & Episodic Memory | 75 | Append-only markdown, `data/memory/YYYY-MM-DD.md` |
| 02 | MEMORY.md Bidireccional | 75 | `memory/markdown.py`, watchdog, threading.Event guard |
| 03 | Consolidación por LLM | 100 | `memory/consolidator.py`, dedup con difflib, merge |
| 04 | Flush Pre-Compactación | 75 | `flush_to_memory()`, extracción de facts antes de borrar mensajes |

**Conceptos clave**: episodic memory, bidirectional sync, file watching, LLM-assisted dedup

### Módulo 6 — Skills Framework
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Anatomía de un Skill | 50 | SKILL.md frontmatter, `ToolDefinition`, `ToolResult` |
| 01 | Registry Pattern | 75 | `SkillRegistry`, registro dinámico, schemas Ollama |
| 02 | Loader de SKILL.md | 75 | Regex parser (sin PyYAML), frontmatter → metadata |
| 03 | Implementar un Skill | 100 | Hands-on: crear un skill completo desde cero |
| 04 | Testing de Skills | 75 | Mocks de OllamaClient, fixtures async, bypass_router |

**Conceptos clave**: registry pattern, frontmatter parsing, tool schemas, dependency injection

---

## Tier 3: Intermediate — Inteligencia del Sistema

> **Prerequisitos**: Tier 2 completado
> **Resultado**: App que entiende intenciones, busca semánticamente, y construye contexto inteligente

### Módulo 7 — Tool Calling & Execution Loop
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Chat con Herramientas | 50 | `chat_with_tools()`, structured output, `think` param |
| 01 | El Loop de Ejecución | 75 | `execute_tool_loop()`, MAX_TOOL_ITERATIONS=5, re-entry |
| 02 | Ejecución Paralela de Tools | 75 | `_run_tool_call()`, `asyncio.gather`, tool caching |
| 03 | Limpieza de Resultados | 75 | `_clear_old_tool_results()`, context window management |
| 04 | Meta-Tools | 100 | `request_more_tools`, dynamic tool budget, proportional distribution |

**Conceptos clave**: LLM tool calling, iterative execution, parallel async, context management

### Módulo 8 — Intent Classification & Smart Routing
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | El Problema de Routing | 50 | qwen3.5 y el límite de ~6 tools, two-stage routing |
| 01 | classify_intent | 75 | Fast LLM call, `think=False`, 12 categorías, `["none"]` |
| 02 | select_tools | 75 | `TOOL_CATEGORIES`, mapping categorías → tools, cap `max_tools_per_call` |
| 03 | Sticky Categories | 75 | `conversation_state`, fallback si classify retorna "none" |
| 04 | Testing del Router | 100 | `_bypass_router()`, mock classify, edge cases |

**Conceptos clave**: two-stage routing, intent classification, category-based tool selection, fallback strategies

### Módulo 9 — Semantic Search & RAG
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Embeddings 101 | 50 | Qué son, `nomic-embed-text`, 768 dimensiones, distancia L2 |
| 01 | Indexing Pipeline | 75 | `embeddings/indexer.py`, `embed_memory()`, `struct.pack` para blobs |
| 02 | Vector Search | 100 | `search_similar_memories_with_distance()`, threshold filtering |
| 03 | Backfill & Best-Effort | 75 | `backfill_embeddings()`, errores logueados nunca propagados |
| 04 | RAG en Acción | 125 | Query embedding → search → inject context → LLM genera |

**Conceptos clave**: embeddings, vector similarity, RAG pipeline, best-effort I/O, graceful degradation

### Módulo 10 — Context Engineering
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | El Presupuesto de Tokens | 50 | `token_estimator.py`, chars/4 proxy, WARNING >80% |
| 01 | ContextBuilder | 100 | XML tags (`<user_memories>`, etc.), sections skip if empty |
| 02 | ConversationContext.build() | 100 | Factory async, Phase A+B centralizado, parallel fetches |
| 03 | Fact Extraction | 75 | Regex-based, sin LLM, `fact_extractor.py`, user_facts |
| 04 | Ensamblando el Prompt Final | 100 | `_build_context()`, system message consolidado, capabilities |

**Conceptos clave**: token budgeting, XML-structured prompts, async factory pattern, context engineering

---

## Tier 4: Advanced — Calidad y Observabilidad

> **Prerequisitos**: Tier 3 completado
> **Resultado**: App con guardrails de producción, trazabilidad completa, y pipeline de evaluación

### Módulo 11 — Multimedia Processing
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Audio: faster-whisper | 50 | Transcripción local, `asyncio.run_in_executor()`, modelos |
| 01 | Imágenes: Vision LLM | 75 | `llava:7b`, model override, image → text description |
| 02 | Markdown → WhatsApp | 75 | `markdown_to_wa.py`, bold placeholder strategy, escapes |
| 03 | Markdown → Telegram HTML | 75 | `telegram_md.py`, escape-first pattern, tags HTML |
| 04 | Message Splitting | 100 | `splitter.py`, >4096 chars, breakpoints: `\n\n` > `". "` > `" "` |

**Conceptos clave**: audio transcription, vision models, platform-specific formatting, message chunking

### Módulo 12 — Guardrails & Quality Control
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Por Qué Guardrails | 50 | Riesgos de producción, fail-open vs fail-closed |
| 01 | Checks Determinísticos | 75 | `check_not_empty`, `check_no_pii`, regex patterns |
| 02 | Checks LLM (Opt-in) | 100 | `check_tool_coherence`, `check_hallucination`, `think=False` |
| 03 | Pipeline & Remediación | 100 | `run_guardrails()`, single-shot remediation, bilingüe |
| 04 | Guardrails → Dataset | 100 | Failures curados automáticamente, scores → Langfuse |

**Conceptos clave**: guardrails, PII detection, hallucination check, remediation, fail-open design

### Módulo 13 — Tracing & Observability
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Intro a Observabilidad | 50 | Logs vs Metrics vs Traces, por qué trace LLM calls |
| 01 | Langfuse v3 SDK | 75 | `start_span()`, `create_score()`, `usage_details`, trace IDs (32 hex) |
| 02 | TraceContext & Propagation | 100 | `contextvars.ContextVar`, async context managers, span hierarchy |
| 03 | TraceRecorder | 100 | Singleton, `_active_spans`, `_root_spans`, best-effort persistence |
| 04 | Scores y Métricas | 100 | Guardrail scores, LLM-as-judge, user signals, sampling rate |

**Conceptos clave**: distributed tracing, Langfuse, context propagation, observability patterns

### Módulo 14 — Evaluation & Self-Improvement
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | El Dataset Vivo | 50 | 3-tier curation: failures, golden, candidates |
| 01 | Señales de Usuario | 75 | Reactions, `/rate`, `/feedback`, training signal |
| 02 | LLM-as-Judge | 100 | Binary eval, `think=False`, offline benchmark |
| 03 | Prompt Versioning | 100 | `prompt_versions` table, `get_active_prompt()`, cache chain |
| 04 | Auto-Evolución | 150 | `evolution.py`, self-correction memories, `/approve-prompt` |

**Conceptos clave**: live datasets, LLM evaluation, prompt versioning, human-in-the-loop improvement

---

## Tier 5: Expert — Modo Agéntico

> **Prerequisitos**: Tier 4 completado
> **Resultado**: Entender y poder construir un agente autónomo con planificación y seguridad

### Módulo 15 — Agent Sessions & Reactive Loop
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Qué es un Agente | 50 | Reactive vs proactive, loops, autonomía, `/agent` |
| 01 | AgentSession Model | 75 | `agent/models.py`, states, scratchpad, persistence |
| 02 | Reactive Loop | 100 | `_run_reactive_session()`, tool loop lineal, max rounds |
| 03 | Loop Detection | 100 | Fibonacci backoff (2,3,5,8,13,21,∞), halt strategies |
| 04 | Session Persistence | 150 | Append-only JSONL, `data/agent_sessions/`, recovery |

**Conceptos clave**: agent architecture, session state, loop detection, append-only persistence

### Módulo 16 — Planner-Orchestrator Architecture
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | El Patrón Planner-Worker | 50 | UNDERSTAND → EXECUTE → SYNTHESIZE, 3 fases |
| 01 | Plan Creation | 100 | `_run_planner()`, structured JSON plan, task steps |
| 02 | Worker Execution | 100 | `execute_worker()`, sequential per task, tool delegation |
| 03 | Replanning | 125 | Synthesize → replan (max 3), handling failures |
| 04 | Task Memory | 150 | `task_memory.py`, markdown task lists, checkpoint updates |

**Conceptos clave**: planning architecture, task decomposition, replanning, multi-step execution

### Módulo 17 — Agentic Security & HITL
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Defense in Depth | 50 | Layers: denylist → policy → audit → HITL |
| 01 | PolicyEngine | 75 | YAML regex rules, ALLOW/DENY/ASK, `policy_engine.py` |
| 02 | AuditTrail | 100 | Append-only JSONL, SHA-256 hash chain, tamper detection |
| 03 | Shell Execution Segura | 100 | Denylist, allowlist, `shell=False`, `stdin=DEVNULL`, gating |
| 04 | Human-in-the-Loop | 150 | `request_user_approval()`, approval via WhatsApp, timeout |

**Conceptos clave**: security layers, policy engines, audit trails, hash chains, HITL approval

---

## Tier 6: Specialist — Extensibilidad y Dominio

> **Prerequisitos**: Módulo 15 mínimo
> **Resultado**: Capacidad de extender la plataforma con nuevos canales, protocolos, y automatizaciones

### Módulo 18 — Multi-Platform & MCP Integration
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Protocol Pattern en Python | 50 | `typing.Protocol`, `runtime_checkable`, duck typing |
| 01 | PlatformClient | 100 | 7 métodos abstractos, `WhatsAppPlatformAdapter` |
| 02 | TelegramClient | 100 | `sendChatAction`, `tg_<chat_id>`, zero-migration ID |
| 03 | MCP: Model Context Protocol | 100 | stdio/HTTP transport, `McpManager`, tool registration |
| 04 | Hot-Reload & Extensibility | 125 | `hot_add_server()`, Smithery registry, dynamic install |

**Conceptos clave**: Protocol pattern, adapter pattern, MCP, hot-reload, platform abstraction

### Módulo 19 — Knowledge Graphs & Data Provenance
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Knowledge Graph Basics | 50 | Entidades, relaciones, grafos, BFS traversal |
| 01 | EntityRegistry | 100 | CRUD, `entities` + `entity_relations`, topic detection |
| 02 | Graph Enrichment | 100 | `enricher.py`, 1000-char budget, context injection |
| 03 | Data Provenance | 100 | `entity_audit_log`, actors, snapshots before/after |
| 04 | Memory Versions | 125 | Append-only history, lineage tracking, `/trace-origin` |

**Conceptos clave**: knowledge graphs, BFS, data lineage, audit trails, immutable history

### Módulo 20 — Operational Automation
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Rule Engine Pattern | 50 | IF condition THEN action, declarative rules |
| 01 | Conditions: query, metric, schedule | 100 | SQL queries, named metrics, cron expressions |
| 02 | Actions: notify, run_task, log | 100 | PlatformClient routing, background tasks, cooldowns |
| 03 | Built-in Rules | 75 | 5 reglas: inactive project, guardrail degraded, etc. |
| 04 | Building Custom Rules | 100 | End-to-end: definir condición → acción → deploy |

**Conceptos clave**: rule engines, declarative automation, condition/action patterns, operational monitoring

---

## Tier 7: Production — Rendimiento y Deploy

> **Prerequisitos**: Tier 4 completado (Tier 5-6 opcionales)
> **Resultado**: Capacidad de optimizar y desplegar un sistema AI en producción

### Módulo 21 — Performance Optimization
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Profiling del Critical Path | 50 | Fases A/B/C/D, identificar bottlenecks |
| 01 | Paralelización con asyncio | 100 | `asyncio.gather`, `create_task`, `to_thread` |
| 02 | Caching Estratégico | 100 | `_cached_tools_map`, `_conv_id_cache`, module-level cache |
| 03 | SQLite Performance | 100 | PRAGMAs, indexes, `ORDER BY id DESC` tiebreaking |
| 04 | Event Loop Hygiene | 125 | `run_in_executor`, never block, background task tracking |

**Conceptos clave**: async profiling, parallelization, caching strategies, database tuning

### Módulo 22 — Production Deployment & CI/CD
| # | Lección | XP | Temas |
|---|---------|-----|-------|
| 00 | Docker para AI Apps | 50 | `appuser` (UID=1000), layer caching, multi-stage |
| 01 | Health Checks | 75 | `/health` (liveness), `/ready` (readiness), probes |
| 02 | CI Pipeline | 100 | GitHub Actions: lint → typecheck → test, ruff + mypy |
| 03 | Eval en CI | 150 | `scripts/run_eval.py`, exit codes, threshold gates |
| 04 | Monitoreo en Producción | 150 | Langfuse dashboards, alerting, trace retention |

**Conceptos clave**: containerization, health checks, CI/CD, eval-in-CI, production monitoring

---

## Resumen de XP y Progresión

| Tier | Módulos | Lecciones | XP Lecciones | Challenge XP | Total XP |
|------|---------|-----------|-------------|-------------|----------|
| Foundation | 0-2 | 15 | 725 | 600 | 1,325 |
| Core | 3-6 | 20 | 1,400 | 400 | 1,800 |
| Intermediate | 7-10 | 20 | 1,600 | 500 | 2,100 |
| Advanced | 11-14 | 20 | 1,700 | 500 | 2,200 |
| Expert | 15-17 | 15 | 1,475 | 600 | 2,075 |
| Specialist | 18-20 | 15 | 1,375 | 500 | 1,875 |
| Production | 21-22 | 10 | 1,000 | 600 | 1,600 |
| **TOTAL** | **23** | **115** | **9,275** | **3,700** | **12,975** |

## Learning Paths Recomendados

### Path A: "Backend AI Developer" (Mínimo viable)
Módulos: 0-10, 12, 21 → **13 módulos, ~65 lecciones**

### Path B: "AI Agent Builder" (Full agent stack)
Módulos: 0-10, 12-13, 15-17 → **17 módulos, ~85 lecciones**

### Path C: "Production AI Engineer" (Todo)
Módulos: 0-22 → **23 módulos, 115 lecciones**

---

## Formato de cada Lección

```
1. Introducción conceptual (2-3 párrafos + Callout)
2. Código real de WasAP con explicación línea por línea
3. Diagrama o FileTree si aplica
4. Ejercicio interactivo (Terminal/CodeBlock)
5. Quiz de comprensión (2-3 preguntas)
6. Resumen + link al siguiente tema
```

## Formato de cada Challenge

```
1. Briefing (qué se debe construir)
2. Starter code (función/clase con `pass`)
3. Test suite (5-8 assertions)
4. Hints progresivos (3 niveles)
5. XP reward + badge unlock
```

## Badges Nuevos (Propuestos)

| Badge | Condición | Tier |
|-------|-----------|------|
| **Database Architect** | Completar Módulo 3 challenge | Core |
| **Memory Master** | Completar Módulo 5 | Core |
| **Tool Smith** | Crear un skill funcional (Módulo 6 challenge) | Core |
| **Context Engineer** | Completar Módulo 10 | Intermediate |
| **Quality Guardian** | Completar Módulo 12 challenge | Advanced |
| **Trace Detective** | Completar Módulo 13 | Advanced |
| **Agent Architect** | Completar Tier 5 (Expert) | Expert |
| **Platform Pioneer** | Completar Módulo 18 | Specialist |
| **Production Ready** | Completar Tier 7 | Production |
| **Full Stack AI** | Completar los 23 módulos | Capstone |
