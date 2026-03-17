import Link from "next/link";
import { Zap, Code, Gamepad2, Monitor } from "lucide-react";
import { codeToHtml } from "shiki";
import HeroXPBadge from "./HeroXPBadge";

const HERO_CODE = `from agents import Agent, Runner
from tools import search_web, execute_sql

agent = Agent(
    name="WasAP Assistant",
    instructions="Sos un asistente experto en IA.",
    tools=[search_web, execute_sql],
    model="gpt-4o-mini",
)

result = Runner.run_sync(agent, "¿Qué es RAG?")
print(result.final_output)`;

const PILLS = [
  { icon: Code, label: "Código de producción" },
  { icon: Gamepad2, label: "Gamificado con XP" },
  { icon: Monitor, label: "Editor en browser" },
];

export default async function HeroSection() {
  const codeHtml = await codeToHtml(HERO_CODE.trim(), {
    lang: "python",
    theme: "github-dark",
  });

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Aprendé <span className="text-primary">IA</span> con código real
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            No más ejemplos de juguete. Aprendé IA Generativa construyendo un
            asistente de producción: 85 archivos, 316 tests, memoria, RAG,
            agentes y más.
          </p>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            {PILLS.map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-secondary-foreground"
              >
                <pill.icon className="h-3.5 w-3.5 text-primary" />
                {pill.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Zap className="h-5 w-5" />
              Empezar a aprender
            </Link>
            <a
              href="#modulos"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Ver el Skill Tree
            </a>
          </div>
        </div>

        {/* Code preview column */}
        <div className="animate-fade-in-up stagger-2 relative">
          <div className="relative rounded-xl border border-border bg-card shadow-2xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                agent.py
              </span>
            </div>
            <div
              className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:m-0 [&>pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: codeHtml }}
            />
          </div>

          {/* Floating XP badge */}
          <HeroXPBadge />
        </div>
      </div>
    </section>
  );
}
