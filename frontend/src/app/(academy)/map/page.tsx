import { Lock, CheckCircle, Circle, Zap } from "lucide-react";
import type { ModuleInfo } from "@/types";

const MODULES: ModuleInfo[] = [
  // Tier 1: Foundation
  { id: "module-0", title: "Setup & Onboarding", description: "Estructura del proyecto, Docker y entorno local", tier: "Foundation", lessonCount: 5 },
  { id: "module-1", title: "Webhook Pipeline", description: "Recibir y procesar mensajes de WhatsApp via webhooks", tier: "Foundation", lessonCount: 5 },
  { id: "module-2", title: "LLM Integration", description: "Conectar con Ollama y LLMs locales para generar respuestas", tier: "Foundation", lessonCount: 5 },
  // Tier 2: Core
  { id: "module-3", title: "Database & Persistence", description: "SQLite async, repository pattern y vector storage", tier: "Core", lessonCount: 5 },
  { id: "module-4", title: "Conversation & State", description: "Historial con ventana, summarizer y compactacion", tier: "Core", lessonCount: 5 },
  { id: "module-5", title: "Memory System", description: "Memorias semanticas, daily logs y consolidacion", tier: "Core", lessonCount: 5 },
  { id: "module-6", title: "Skills Framework", description: "SKILL.md, registry pattern y tool definitions", tier: "Core", lessonCount: 5 },
  // Tier 3: Intermediate
  { id: "module-7", title: "Tool Calling & Execution", description: "Loop de ejecucion de tools, paralelismo y meta-tools", tier: "Intermediate", lessonCount: 5 },
  { id: "module-8", title: "Intent Classification & Routing", description: "Two-stage routing, classify_intent y sticky categories", tier: "Intermediate", lessonCount: 5 },
  { id: "module-9", title: "Semantic Search & RAG", description: "Embeddings, sqlite-vec y retrieval-augmented generation", tier: "Intermediate", lessonCount: 5 },
  { id: "module-10", title: "Context Engineering", description: "Token budgets, ContextBuilder y prompt assembly", tier: "Intermediate", lessonCount: 5 },
  // Tier 4: Advanced
  { id: "module-11", title: "Multimedia Processing", description: "Audio con faster-whisper, vision con LLaVA y formatting", tier: "Advanced", lessonCount: 5 },
  { id: "module-12", title: "Guardrails & Quality", description: "Checks deterministicos, LLM checks y remediacion", tier: "Advanced", lessonCount: 5 },
  { id: "module-13", title: "Tracing & Observability", description: "Langfuse v3, TraceContext y scores de calidad", tier: "Advanced", lessonCount: 5 },
  { id: "module-14", title: "Evaluation & Self-Improvement", description: "Dataset vivo, LLM-as-judge y prompt versioning", tier: "Advanced", lessonCount: 5 },
  // Tier 5: Expert
  { id: "module-15", title: "Agent Sessions & Reactive Loop", description: "Sesiones agénticas, scratchpad y loop detection", tier: "Expert", lessonCount: 5 },
  { id: "module-16", title: "Planner-Orchestrator", description: "Patron planner-worker, replanificacion y sintesis", tier: "Expert", lessonCount: 5 },
  { id: "module-17", title: "Agentic Security & HITL", description: "PolicyEngine, audit trail y human-in-the-loop", tier: "Expert", lessonCount: 5 },
  // Tier 6: Specialist
  { id: "module-18", title: "Multi-Platform & MCP", description: "PlatformClient Protocol, Telegram y MCP hot-reload", tier: "Specialist", lessonCount: 5 },
  { id: "module-19", title: "Knowledge Graphs & Provenance", description: "Entidades, relaciones, BFS traversal y data lineage", tier: "Specialist", lessonCount: 5 },
  { id: "module-20", title: "Operational Automation", description: "Rule engine, condiciones, acciones y reglas custom", tier: "Specialist", lessonCount: 5 },
  // Tier 7: Production
  { id: "module-21", title: "Performance Optimization", description: "Paralelizacion asyncio, caching y SQLite tuning", tier: "Production", lessonCount: 5 },
  { id: "module-22", title: "Production Deployment & CI/CD", description: "Docker, health checks, CI pipeline y eval en CI", tier: "Production", lessonCount: 5 },
];

const TIER_COLORS: Record<string, string> = {
  Foundation:   "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Core:         "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Intermediate: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  Advanced:     "text-purple-400 border-purple-400/30 bg-purple-400/10",
  Expert:       "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Specialist:   "text-amber-400 border-amber-400/30 bg-amber-400/10",
  Production:   "text-red-400 border-red-400/30 bg-red-400/10",
};

function ModuleStatusIcon({ index }: { index: number }) {
  if (index === 0) return <Circle className="h-5 w-5 text-accent" />;
  if (index < 0) return <CheckCircle className="h-5 w-5 text-success" />;
  return <Lock className="h-5 w-5 text-muted-foreground" />;
}

export default function SkillTreePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Skill Tree</h1>
        <p className="mt-2 text-muted-foreground">
          Tu camino de novato a maestro en IA Generativa
        </p>
      </div>

      <div className="space-y-3">
        {MODULES.map((mod, i) => (
          <div
            key={mod.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
              {i}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{mod.title}</h3>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_COLORS[mod.tier]}`}>
                  {mod.tier}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{mod.description}</p>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-xp-gold" />
                {mod.lessonCount} lecciones
              </span>
              <ModuleStatusIcon index={i} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
