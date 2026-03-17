"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface ModuleInfo {
  id: string;
  title: string;
  tier: string;
  lessons: { lessonId: string }[];
}

interface ContinueCardProps {
  modules: ModuleInfo[];
}

export function ContinueCard({ modules }: ContinueCardProps) {
  const { data: progress, loading } = useProgress();

  if (loading || !progress) return null;

  // Find the first module that has content but is not fully completed
  const nextModule = modules.find((mod) => {
    if (mod.lessons.length === 0) return false;

    const completedLessons = progress.lessons.filter(
      (l) => l.module_id === mod.id && l.status === "completed"
    );

    return completedLessons.length < mod.lessons.length;
  });

  if (!nextModule) return null;

  const completedCount = progress.lessons.filter(
    (l) => l.module_id === nextModule.id && l.status === "completed"
  ).length;

  const totalCount = nextModule.lessons.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
        Continua donde lo dejaste
      </p>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground">{nextModule.title}</h3>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
        <Link
          href={`/modules/${nextModule.id}`}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
