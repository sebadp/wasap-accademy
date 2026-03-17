import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { LessonMeta, ModuleMeta, LessonContent } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "modules");

const MODULE_META: Record<string, Omit<ModuleMeta, "lessons" | "totalXP">> = {
  // Tier 1: Foundation
  "module-0": { id: "module-0", title: "Setup & Onboarding", description: "Estructura del proyecto, Docker y entorno local.", tier: "Foundation", order: 0 },
  "module-1": { id: "module-1", title: "Webhook Pipeline", description: "Recibir y procesar mensajes de WhatsApp via webhooks.", tier: "Foundation", order: 1 },
  "module-2": { id: "module-2", title: "LLM Integration", description: "Conectar con Ollama y LLMs locales para generar respuestas.", tier: "Foundation", order: 2 },
  // Tier 2: Core
  "module-3": { id: "module-3", title: "Database & Persistence", description: "SQLite async, repository pattern y vector storage.", tier: "Core", order: 3 },
  "module-4": { id: "module-4", title: "Conversation & State", description: "Historial con ventana, summarizer y compactación.", tier: "Core", order: 4 },
  "module-5": { id: "module-5", title: "Memory System", description: "Memorias semánticas, daily logs y consolidación.", tier: "Core", order: 5 },
  "module-6": { id: "module-6", title: "Skills Framework", description: "SKILL.md, registry pattern y tool definitions.", tier: "Core", order: 6 },
  // Tier 3: Intermediate
  "module-7": { id: "module-7", title: "Tool Calling & Execution", description: "Loop de ejecución de tools, paralelismo y meta-tools.", tier: "Intermediate", order: 7 },
  "module-8": { id: "module-8", title: "Intent Classification & Routing", description: "Two-stage routing, classify_intent y sticky categories.", tier: "Intermediate", order: 8 },
  "module-9": { id: "module-9", title: "Semantic Search & RAG", description: "Embeddings, sqlite-vec y retrieval-augmented generation.", tier: "Intermediate", order: 9 },
  "module-10": { id: "module-10", title: "Context Engineering", description: "Token budgets, ContextBuilder y prompt assembly.", tier: "Intermediate", order: 10 },
  // Tier 4: Advanced
  "module-11": { id: "module-11", title: "Multimedia Processing", description: "Audio con faster-whisper, vision con LLaVA y formatting.", tier: "Advanced", order: 11 },
  "module-12": { id: "module-12", title: "Guardrails & Quality", description: "Checks determinísticos, LLM checks y remediación.", tier: "Advanced", order: 12 },
  "module-13": { id: "module-13", title: "Tracing & Observability", description: "Langfuse v3, TraceContext y scores de calidad.", tier: "Advanced", order: 13 },
  "module-14": { id: "module-14", title: "Evaluation & Self-Improvement", description: "Dataset vivo, LLM-as-judge y prompt versioning.", tier: "Advanced", order: 14 },
  // Tier 5: Expert
  "module-15": { id: "module-15", title: "Agent Sessions & Reactive Loop", description: "Sesiones agénticas, scratchpad y loop detection.", tier: "Expert", order: 15 },
  "module-16": { id: "module-16", title: "Planner-Orchestrator", description: "Patrón planner-worker, replanificación y síntesis.", tier: "Expert", order: 16 },
  "module-17": { id: "module-17", title: "Agentic Security & HITL", description: "PolicyEngine, audit trail y human-in-the-loop.", tier: "Expert", order: 17 },
  // Tier 6: Specialist
  "module-18": { id: "module-18", title: "Multi-Platform & MCP", description: "PlatformClient Protocol, Telegram y MCP hot-reload.", tier: "Specialist", order: 18 },
  "module-19": { id: "module-19", title: "Knowledge Graphs & Provenance", description: "Entidades, relaciones, BFS traversal y data lineage.", tier: "Specialist", order: 19 },
  "module-20": { id: "module-20", title: "Operational Automation", description: "Rule engine, condiciones, acciones y reglas custom.", tier: "Specialist", order: 20 },
  // Tier 7: Production
  "module-21": { id: "module-21", title: "Performance Optimization", description: "Paralelización asyncio, caching y SQLite tuning.", tier: "Production", order: 21 },
  "module-22": { id: "module-22", title: "Production Deployment & CI/CD", description: "Docker, health checks, CI pipeline y eval en CI.", tier: "Production", order: 22 },
};

function getLessonFiles(moduleId: string): string[] {
  const moduleDir = path.join(CONTENT_DIR, moduleId);
  if (!fs.existsSync(moduleDir)) return [];
  return fs
    .readdirSync(moduleDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();
}

function parseLessonMeta(moduleId: string, filename: string, content: string): LessonMeta {
  const { data } = matter(content);
  const slug = filename.replace(".mdx", "");
  const order = parseInt(slug.split("-")[0], 10);
  const stats = readingTime(content);

  return {
    moduleId,
    lessonId: slug,
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    order,
    xpReward: data.xpReward ?? 50,
    readingTimeMinutes: Math.ceil(stats.minutes),
  };
}

export function getLessonList(moduleId: string): LessonMeta[] {
  const files = getLessonFiles(moduleId);
  return files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, moduleId, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    return parseLessonMeta(moduleId, filename, content);
  });
}

export function getModuleList(): ModuleMeta[] {
  return Object.values(MODULE_META)
    .sort((a, b) => a.order - b.order)
    .map((meta) => {
      const lessons = getLessonList(meta.id);
      return {
        ...meta,
        lessons,
        totalXP: lessons.reduce((sum, l) => sum + l.xpReward, 0),
      };
    });
}

export async function getLessonContent(moduleId: string, lessonId: string): Promise<LessonContent | null> {
  const filePath = path.join(CONTENT_DIR, moduleId, `${lessonId}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const meta = parseLessonMeta(moduleId, `${lessonId}.mdx`, raw);
  const { data } = matter(raw);
  // Strip frontmatter — MDXRemote in the page will compile the body
  const body = raw.replace(/^---[\s\S]+?---\n/, "");

  return { meta: { ...meta, ...data }, source: body };
}
