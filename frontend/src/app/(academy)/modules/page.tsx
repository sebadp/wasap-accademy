import Link from "next/link";
import { getModuleList } from "@/lib/content/loader";
import { BookOpen, Lock, Zap } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  Foundation: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Core:       "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Advanced:   "text-purple-400 border-purple-400/30 bg-purple-400/10",
  Specialist: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  Capstone:   "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function ModulesPage() {
  const modules = getModuleList();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modulos</h1>
        <p className="mt-2 text-muted-foreground">
          {modules.length} modulos disponibles
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((mod, i) => {
          const hasContent = mod.lessons.length > 0;
          return (
            <div key={mod.id} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                  {i}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-foreground">{mod.title}</h2>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_COLORS[mod.tier]}`}>
                      {mod.tier}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {mod.lessons.length > 0 ? `${mod.lessons.length} lecciones` : "Proximamente"}
                    </span>
                    {mod.totalXP > 0 && (
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-xp-gold" />
                        {mod.totalXP} XP
                      </span>
                    )}
                  </div>
                </div>
                {hasContent ? (
                  <Link
                    href={`/modules/${mod.id}`}
                    className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Entrar
                  </Link>
                ) : (
                  <div className="flex flex-shrink-0 items-center gap-1 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Bloqueado
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
