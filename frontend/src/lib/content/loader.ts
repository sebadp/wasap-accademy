import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { LessonMeta, ModuleMeta, LessonContent } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "modules");

const MODULE_META: Record<string, Omit<ModuleMeta, "lessons" | "totalXP">> = {
  "module-0": { id: "module-0", title: "Setup & Onboarding", description: "Estructura del proyecto, Docker y entorno local.", tier: "Foundation", order: 0 },
  "module-1": { id: "module-1", title: "Webhook Pipeline", description: "Recibir y procesar mensajes de WhatsApp via webhooks.", tier: "Foundation", order: 1 },
  "module-2": { id: "module-2", title: "LLM Integration", description: "Conectar con Claude y otros LLMs para generar respuestas.", tier: "Foundation", order: 2 },
  "module-3": { id: "module-3", title: "Database & State", description: "PostgreSQL, modelos de datos y manejo de estado.", tier: "Core", order: 3 },
  "module-4": { id: "module-4", title: "Conversation Memory", description: "Memoria de contexto para conversaciones.", tier: "Core", order: 4 },
  "module-5": { id: "module-5", title: "Skills Framework", description: "Sistema de skills extensible.", tier: "Core", order: 5 },
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
