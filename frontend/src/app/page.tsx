import Link from "next/link";
import { Flame, Code, Zap, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

const FEATURES = [
  {
    icon: Code,
    title: "Codigo real de produccion",
    description: "Aprende de WasAP: un asistente de WhatsApp con 85 archivos Python, 15 skills y 316 tests.",
  },
  {
    icon: Zap,
    title: "Challenges en el navegador",
    description: "Ejecuta Python directamente en el browser con Pyodide. Sin instalar nada.",
  },
  {
    icon: Trophy,
    title: "Gamificacion completa",
    description: "XP, niveles, badges, streaks y leaderboard. Aprende compitiendo.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <header className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Flame className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">AgentCraft</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Empezar gratis
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Aprende <span className="text-primary">IA Generativa</span> construyendo un proyecto real
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            17 modulos. De webhook a multi-agentes. Todo basado en codigo de produccion.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Zap className="h-5 w-5" />
            Comenzar ahora
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <f.icon className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        AgentCraft — Learn GenAI by building
      </footer>
    </div>
  );
}
