import { Lock, CheckCircle, Circle, Zap } from "lucide-react";
import type { ModuleInfo } from "@/types";

const MODULES: ModuleInfo[] = [
  { id: "module-0", title: "Setup & Onboarding", description: "Estructura del proyecto, Docker, entorno local", tier: "Foundation", lessonCount: 5 },
  { id: "module-1", title: "Webhook Pipeline", description: "Recibir mensajes de WhatsApp via webhooks", tier: "Foundation", lessonCount: 7 },
  { id: "module-2", title: "LLM Integration", description: "Conectar con Claude y otros LLMs", tier: "Foundation", lessonCount: 7 },
  { id: "module-3", title: "Database & State", description: "PostgreSQL, modelos de datos, estado", tier: "Core", lessonCount: 5 },
  { id: "module-4", title: "Conversation Memory", description: "Memoria de contexto para conversaciones", tier: "Core", lessonCount: 5 },
  { id: "module-5", title: "Skills Framework", description: "Sistema de skills extensible", tier: "Core", lessonCount: 5 },
  { id: "module-6", title: "Tool Calling", description: "Function calling con LLMs", tier: "Core", lessonCount: 5 },
  { id: "module-7", title: "RAG Pipeline", description: "Retrieval Augmented Generation", tier: "Advanced", lessonCount: 5 },
  { id: "module-8", title: "Guardrails", description: "Seguridad y filtros para LLMs", tier: "Advanced", lessonCount: 5 },
  { id: "module-9", title: "Tracing & Observability", description: "Monitoreo y debugging de agentes", tier: "Advanced", lessonCount: 5 },
  { id: "module-10", title: "Multi-Agent Patterns", description: "Orquestacion de multiples agentes", tier: "Advanced", lessonCount: 5 },
];

const TIER_COLORS: Record<string, string> = {
  Foundation: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Core: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Advanced: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  Specialist: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  Capstone: "text-red-400 border-red-400/30 bg-red-400/10",
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
