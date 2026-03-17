"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Trophy, Code2, FileCode } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Tier = "foundation" | "core" | "advanced" | "specialist" | "capstone";

interface ModuleData {
  id: number;
  title: string;
  tier: Tier;
  lessons: number;
  description: string;
  topics: string[];
  challenge: string;
  badge: string;
  source: string;
}

/* ------------------------------------------------------------------ */
/*  Tier visual styles                                                 */
/* ------------------------------------------------------------------ */

const TIER_STYLES: Record<
  Tier,
  {
    card: string;
    dot: string;
    text: string;
    badge: string;
    label: string;
    connector: string;
    bg: string;
  }
> = {
  foundation: {
    card: "border-emerald-500/30 hover:border-emerald-500/50",
    dot: "bg-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    label: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
    connector: "stroke-emerald-500/40",
    bg: "bg-emerald-500",
  },
  core: {
    card: "border-blue-500/30 hover:border-blue-500/50",
    dot: "bg-blue-500",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    label: "text-blue-400 border-blue-500/30 bg-blue-500/5",
    connector: "stroke-blue-500/40",
    bg: "bg-blue-500",
  },
  advanced: {
    card: "border-violet-500/30 hover:border-violet-500/50",
    dot: "bg-violet-500",
    text: "text-violet-400",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    label: "text-violet-400 border-violet-500/30 bg-violet-500/5",
    connector: "stroke-violet-500/40",
    bg: "bg-violet-500",
  },
  specialist: {
    card: "border-amber-500/30 hover:border-amber-500/50",
    dot: "bg-amber-500",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    label: "text-amber-400 border-amber-500/30 bg-amber-500/5",
    connector: "stroke-amber-500/40",
    bg: "bg-amber-500",
  },
  capstone: {
    card: "border-red-500/30 hover:border-red-500/50",
    dot: "bg-red-500",
    text: "text-red-400",
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
    label: "text-red-400 border-red-500/30 bg-red-500/5",
    connector: "stroke-red-500/40",
    bg: "bg-red-500",
  },
};

const TIER_LABELS: Record<Tier, string> = {
  foundation: "Foundation",
  core: "Core",
  advanced: "Advanced",
  specialist: "Specialist",
  capstone: "Capstone",
};

/* ------------------------------------------------------------------ */
/*  Module data — 17 modules, 7 rows                                   */
/* ------------------------------------------------------------------ */

interface TierRow {
  tier: Tier;
  modules: ModuleData[];
}

const TIER_ROWS: TierRow[] = [
  {
    tier: "foundation",
    modules: [
      {
        id: 0,
        title: "Setup & Onboarding",
        tier: "foundation",
        lessons: 5,
        description:
          "Configura tu entorno de desarrollo, levanta Docker, entiende la estructura del proyecto WasAP y corre tus primeros tests.",
        topics: [
          "Estructura de proyecto Python profesional",
          "Docker y docker-compose para desarrollo",
          "Variables de entorno y configuración",
          "Corriendo el test suite por primera vez",
        ],
        challenge: "Levantar WasAP en local y pasar todos los health checks",
        badge: "First Boot",
        source: "Project root, docker",
      },
    ],
  },
  {
    tier: "foundation",
    modules: [
      {
        id: 1,
        title: "Webhook Pipeline",
        tier: "foundation",
        lessons: 7,
        description:
          "Implementa el pipeline de webhooks que recibe mensajes de WhatsApp, los valida, y los despacha al sistema de procesamiento.",
        topics: [
          "Webhook verification handshake",
          "Parsing de mensajes entrantes",
          "Queue de procesamiento asíncrono",
          "Manejo de errores y reintentos",
        ],
        challenge: "Procesar 100 mensajes webhook sin perder ninguno",
        badge: "Signal Catcher",
        source: "app/webhook/",
      },
      {
        id: 2,
        title: "LLM Integration",
        tier: "foundation",
        lessons: 7,
        description:
          "Conecta con Claude y otros LLMs, aprende a manejar prompts, streaming, y respuestas estructuradas.",
        topics: [
          "API de Claude: mensajes y system prompts",
          "Streaming de respuestas token a token",
          "Structured output con Pydantic",
          "Fallbacks entre proveedores de LLM",
        ],
        challenge: "Implementar un chatbot que responda en streaming",
        badge: "Prompt Whisperer",
        source: "app/llm/, app/whatsapp/",
      },
      {
        id: 3,
        title: "Database & State",
        tier: "foundation",
        lessons: 5,
        description:
          "Modela datos con PostgreSQL, implementa el estado de conversaciones, y asegura la persistencia del sistema.",
        topics: [
          "Diseño de esquema relacional",
          "Migraciones con Alembic",
          "Repositorio pattern en Python",
          "Connection pooling y optimización",
        ],
        challenge: "Diseñar el esquema completo de conversaciones",
        badge: "Data Architect",
        source: "app/database/",
      },
    ],
  },
  {
    tier: "core",
    modules: [
      {
        id: 4,
        title: "Conversation Memory",
        tier: "core",
        lessons: 5,
        description:
          "Implementa memoria de contexto para que el agente recuerde conversaciones previas y mantenga coherencia.",
        topics: [
          "Window memory vs summary memory",
          "Token counting y truncamiento",
          "Embeddings para búsqueda semántica",
          "Memoria a corto y largo plazo",
        ],
        challenge: "Agente que recuerde las últimas 10 conversaciones",
        badge: "Memory Keeper",
        source: "app/memory/",
      },
      {
        id: 5,
        title: "Skills Framework",
        tier: "core",
        lessons: 5,
        description:
          "Crea un sistema extensible de skills que el agente puede invocar según la intención del usuario.",
        topics: [
          "Registro dinámico de skills",
          "Intent detection con LLM",
          "Parámetros y validación de skills",
          "Composición de skills complejos",
        ],
        challenge: "Crear 3 skills custom con registro automático",
        badge: "Skill Crafter",
        source: "app/skills/registry.py",
      },
      {
        id: 6,
        title: "Tool Calling",
        tier: "core",
        lessons: 5,
        description:
          "Domina function calling con LLMs para que el agente pueda ejecutar acciones concretas en el mundo real.",
        topics: [
          "JSON Schema para definir tools",
          "Ejecución segura de funciones",
          "Tool chaining y pipelines",
          "Error handling en tool calls",
        ],
        challenge: "Pipeline de 3 tools encadenados con error handling",
        badge: "Tool Master",
        source: "app/llm/client.py tools",
      },
    ],
  },
  {
    tier: "advanced",
    modules: [
      {
        id: 7,
        title: "RAG Pipeline",
        tier: "advanced",
        lessons: 5,
        description:
          "Construye un pipeline de Retrieval Augmented Generation para que el agente busque información relevante antes de responder.",
        topics: [
          "Chunking y embeddings de documentos",
          "Vector store con pgvector",
          "Retrieval strategies y re-ranking",
          "Evaluación de calidad RAG",
        ],
        challenge: "RAG pipeline que responda preguntas sobre docs de WasAP",
        badge: "Knowledge Miner",
        source: "app/rag/",
      },
      {
        id: 8,
        title: "Guardrails",
        tier: "advanced",
        lessons: 5,
        description:
          "Implementa capas de seguridad para filtrar contenido dañino, PII, y garantizar respuestas seguras.",
        topics: [
          "Input validation y sanitización",
          "Detección de PII y datos sensibles",
          "Content moderation con LLM",
          "Rate limiting y abuse prevention",
        ],
        challenge: "Sistema de guardrails que bloquee 5 tipos de contenido",
        badge: "Shield Bearer",
        source: "app/guardrails/",
      },
      {
        id: 9,
        title: "Tracing & Observability",
        tier: "advanced",
        lessons: 5,
        description:
          "Agrega tracing, logging estructurado, y métricas para entender qué hace tu agente en producción.",
        topics: [
          "Distributed tracing con OpenTelemetry",
          "Logging estructurado con structlog",
          "Métricas de latencia y tokens",
          "Dashboards de monitoreo",
        ],
        challenge: "Trazar una conversación completa end-to-end",
        badge: "Trace Hunter",
        source: "app/tracing/",
      },
    ],
  },
  {
    tier: "specialist",
    modules: [
      {
        id: 10,
        title: "Multi-Agent Patterns",
        tier: "specialist",
        lessons: 5,
        description:
          "Diseña sistemas donde múltiples agentes colaboran, se comunican, y se supervisan mutuamente.",
        topics: [
          "Supervisor pattern y delegación",
          "Comunicación inter-agentes",
          "Consensus y votación entre agentes",
          "Escalación y fallback patterns",
        ],
        challenge: "Sistema de 3 agentes con supervisor",
        badge: "Orchestrator",
        source: "app/agents/",
      },
      {
        id: 11,
        title: "Media Processing",
        tier: "specialist",
        lessons: 5,
        description:
          "Procesa imágenes, audio, y documentos que los usuarios envían por WhatsApp.",
        topics: [
          "Descarga y almacenamiento de media",
          "Vision con modelos multimodales",
          "Speech-to-text para audios",
          "OCR y extracción de documentos",
        ],
        challenge: "Procesar imagen + audio en una sola conversación",
        badge: "Media Wizard",
        source: "app/media/",
      },
      {
        id: 12,
        title: "Scheduling",
        tier: "specialist",
        lessons: 5,
        description:
          "Implementa tareas programadas, recordatorios, y procesos batch para el agente.",
        topics: [
          "Cron jobs con APScheduler",
          "Recordatorios para usuarios",
          "Batch processing de mensajes",
          "Retry logic y dead letter queues",
        ],
        challenge: "Sistema de recordatorios con persistencia",
        badge: "Time Lord",
        source: "app/skills/scheduling/",
      },
    ],
  },
  {
    tier: "specialist",
    modules: [
      {
        id: 13,
        title: "Web Search",
        tier: "specialist",
        lessons: 5,
        description:
          "Dale al agente la capacidad de buscar en internet para responder preguntas con información actualizada.",
        topics: [
          "APIs de búsqueda (Brave, Tavily)",
          "Scraping y parsing de resultados",
          "Grounding: verificar fuentes",
          "Citación de fuentes en respuestas",
        ],
        challenge: "Agente que busque y cite 3 fuentes por respuesta",
        badge: "Web Crawler",
        source: "app/skills/web_search/",
      },
      {
        id: 14,
        title: "Performance Tuning",
        tier: "specialist",
        lessons: 5,
        description:
          "Optimiza latencia, costos de tokens, y throughput de tu agente para escalar en producción.",
        topics: [
          "Caching de respuestas LLM",
          "Prompt optimization (menos tokens)",
          "Batching y concurrent requests",
          "Profiling y bottleneck analysis",
        ],
        challenge: "Reducir latencia P95 en 50% con caching",
        badge: "Speed Demon",
        source: "Various",
      },
      {
        id: 15,
        title: "Testing Mastery",
        tier: "specialist",
        lessons: 5,
        description:
          "Domina testing de sistemas de IA: mocks de LLMs, evaluación de calidad, y tests de integración.",
        topics: [
          "Mocking de LLM responses",
          "Evaluation frameworks (RAGAS, etc.)",
          "Integration tests con Testcontainers",
          "CI/CD para proyectos de IA",
        ],
        challenge: "Suite de 20 tests con coverage > 80%",
        badge: "Quality Guardian",
        source: "tests/",
      },
    ],
  },
  {
    tier: "capstone",
    modules: [
      {
        id: 16,
        title: "Production Deploy",
        tier: "capstone",
        lessons: 5,
        description:
          "Despliega WasAP completo a producción con CI/CD, monitoreo, y zero-downtime deployments.",
        topics: [
          "Docker multi-stage builds",
          "CI/CD con GitHub Actions",
          "Blue-green deployments",
          "Alertas y runbooks de producción",
        ],
        challenge: "Deploy completo con pipeline CI/CD funcional",
        badge: "Ship Captain",
        source: "Docker, CI/CD",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  SVG Tree Connector                                                 */
/* ------------------------------------------------------------------ */

type ConnectorType = "fan-out" | "fan-in" | "straight-3" | "straight-1";

function TreeConnector({
  type,
  tier,
}: {
  type: ConnectorType;
  tier: Tier;
}) {
  const style = TIER_STYLES[tier];

  return (
    <div className="hidden md:flex justify-center w-full my-1">
      <svg
        viewBox="0 0 600 48"
        className="w-full max-w-4xl h-12"
        preserveAspectRatio="xMidYMid meet"
      >
        {type === "fan-out" && (
          <>
            {/* Center bottom to three top points */}
            <line x1="300" y1="48" x2="100" y2="0" className={style.connector} strokeWidth="2" />
            <line x1="300" y1="48" x2="300" y2="0" className={style.connector} strokeWidth="2" />
            <line x1="300" y1="48" x2="500" y2="0" className={style.connector} strokeWidth="2" />
          </>
        )}
        {type === "fan-in" && (
          <>
            {/* Three bottom points to center top */}
            <line x1="100" y1="48" x2="300" y2="0" className={style.connector} strokeWidth="2" />
            <line x1="300" y1="48" x2="300" y2="0" className={style.connector} strokeWidth="2" />
            <line x1="500" y1="48" x2="300" y2="0" className={style.connector} strokeWidth="2" />
          </>
        )}
        {type === "straight-3" && (
          <>
            {/* Three vertical lines */}
            <line x1="100" y1="48" x2="100" y2="0" className={style.connector} strokeWidth="2" />
            <line x1="300" y1="48" x2="300" y2="0" className={style.connector} strokeWidth="2" />
            <line x1="500" y1="48" x2="500" y2="0" className={style.connector} strokeWidth="2" />
          </>
        )}
        {type === "straight-1" && (
          <line x1="300" y1="48" x2="300" y2="0" className={style.connector} strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tier Label                                                         */
/* ------------------------------------------------------------------ */

function TierLabel({ tier }: { tier: Tier }) {
  const style = TIER_STYLES[tier];
  return (
    <div className="flex justify-center my-3 md:my-4">
      <span
        className={`inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider ${style.label}`}
      >
        {TIER_LABELS[tier]}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill Tree Node (expandable card)                                  */
/* ------------------------------------------------------------------ */

function SkillTreeNode({ mod }: { mod: ModuleData }) {
  const [expanded, setExpanded] = useState(false);
  const style = TIER_STYLES[mod.tier];

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      className={`w-full text-left rounded-xl border bg-card transition-colors cursor-pointer ${style.card}`}
    >
      {/* Header — always visible */}
      <div className="flex items-center gap-3 p-4">
        {/* Tier dot + module number */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${style.dot}`}
        >
          {mod.id}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
            {mod.title}
          </h3>
          <span className="text-xs text-muted-foreground">
            {mod.lessons} lecciones
          </span>
        </div>

        {/* Expand chevron */}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expandable detail */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border/50">
            {/* Description */}
            <p className="text-sm text-muted-foreground pt-3">
              {mod.description}
            </p>

            {/* Topics */}
            <div>
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <BookOpen className="h-3 w-3" />
                Lo que aprenderás
              </h4>
              <ul className="space-y-1">
                {mod.topics.map((topic) => (
                  <li
                    key={topic}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                    />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenge + Badge */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 rounded-lg bg-muted/50 p-2.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Code2 className="h-3 w-3" />
                  Desafío
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {mod.challenge}
                </p>
              </div>
              <div className="flex-1 rounded-lg bg-muted/50 p-2.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Trophy className="h-3 w-3" />
                  Badge
                </span>
                <p className={`text-xs mt-1 font-medium ${style.text}`}>
                  {mod.badge}
                </p>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileCode className="h-3 w-3" />
              <span className="font-mono">{mod.source}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Summary                                                   */
/* ------------------------------------------------------------------ */

const PROGRESS_TIERS: { tier: Tier; count: number }[] = [
  { tier: "foundation", count: 4 },
  { tier: "core", count: 3 },
  { tier: "advanced", count: 3 },
  { tier: "specialist", count: 6 },
  { tier: "capstone", count: 1 },
];

function ProgressSummary() {
  const total = PROGRESS_TIERS.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progreso del curso</span>
        <span className="font-medium text-foreground">0 / {total} módulos</span>
      </div>

      {/* Segmented bar */}
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-muted">
        {PROGRESS_TIERS.map(({ tier, count }) => (
          <div
            key={tier}
            className={`${TIER_STYLES[tier].bg} opacity-30`}
            style={{ width: `${(count / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {PROGRESS_TIERS.map(({ tier }) => (
          <span key={tier} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${TIER_STYLES[tier].dot}`} />
            {TIER_LABELS[tier]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Connector mapping: which connector goes between rows               */
/* ------------------------------------------------------------------ */

interface ConnectorDef {
  type: ConnectorType;
  tier: Tier;
}

// Connectors between row pairs (bottom-to-top order in desktop):
// Row 0 (1 node) → Row 1 (3 nodes): fan-out
// Row 1 (3 nodes) → Row 2 (3 nodes): straight-3
// Row 2 (3 nodes) → Row 3 (3 nodes): straight-3
// Row 3 (3 nodes) → Row 4 (3 nodes): straight-3
// Row 4 (3 nodes) → Row 5 (3 nodes): straight-3
// Row 5 (3 nodes) → Row 6 (1 node): fan-in
const CONNECTORS: ConnectorDef[] = [
  { type: "fan-out", tier: "foundation" },
  { type: "straight-3", tier: "core" },
  { type: "straight-3", tier: "advanced" },
  { type: "straight-3", tier: "specialist" },
  { type: "straight-3", tier: "specialist" },
  { type: "fan-in", tier: "capstone" },
];

/* ------------------------------------------------------------------ */
/*  Mobile vertical connector                                          */
/* ------------------------------------------------------------------ */

function MobileConnector() {
  return (
    <div className="flex md:hidden justify-center">
      <div className="h-4 w-px bg-border" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function SkillTreePreview() {
  // Build desktop rows (bottom-to-top) and mobile rows (top-to-bottom)
  const desktopRows = [...TIER_ROWS].reverse();

  return (
    <section id="modulos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <SectionHeading
            badge="Skill Tree"
            title="17 módulos para dominar IA"
            highlight="dominar IA"
            subtitle="Desde tu primer webhook hasta un sistema multi-agente en producción. Clickea cada módulo para ver detalles."
          />
        </AnimateOnScroll>

        {/* ---- DESKTOP: bottom-to-top tree ---- */}
        <div className="hidden md:flex flex-col mt-14">
          {desktopRows.map((row, reverseIndex) => {
            const rowIndex = TIER_ROWS.length - 1 - reverseIndex;
            const showTierLabel =
              reverseIndex === 0 ||
              desktopRows[reverseIndex - 1]?.tier !== row.tier;
            const showConnectorAbove = rowIndex < TIER_ROWS.length - 1;

            return (
              <AnimateOnScroll key={rowIndex} delay={reverseIndex * 100}>
                {/* Connector above this row (going up to next row) */}
                {showConnectorAbove && (
                  <TreeConnector
                    type={CONNECTORS[rowIndex].type}
                    tier={CONNECTORS[rowIndex].tier}
                  />
                )}

                {/* Tier label on transition */}
                {showTierLabel && <TierLabel tier={row.tier} />}

                {/* Module cards */}
                <div
                  className={`grid gap-4 ${
                    row.modules.length === 1
                      ? "grid-cols-1 max-w-sm mx-auto"
                      : "grid-cols-3"
                  }`}
                >
                  {row.modules.map((mod) => (
                    <SkillTreeNode key={mod.id} mod={mod} />
                  ))}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* ---- MOBILE: top-to-bottom list ---- */}
        <div className="flex md:hidden flex-col mt-14">
          {TIER_ROWS.map((row, rowIndex) => {
            const showTierLabel =
              rowIndex === 0 || TIER_ROWS[rowIndex - 1].tier !== row.tier;

            return (
              <div key={rowIndex}>
                {showTierLabel && <TierLabel tier={row.tier} />}
                {row.modules.map((mod, modIndex) => (
                  <div key={mod.id}>
                    {(rowIndex > 0 || modIndex > 0) && <MobileConnector />}
                    <AnimateOnScroll delay={(rowIndex * 3 + modIndex) * 60}>
                      <SkillTreeNode mod={mod} />
                    </AnimateOnScroll>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <AnimateOnScroll delay={700}>
          <ProgressSummary />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
