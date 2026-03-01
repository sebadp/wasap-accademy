"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeItem } from "@/lib/api/client";
import { CheckCircle, Loader2, Zap } from "lucide-react";

interface Props {
  moduleId: string;
  lessonId: string;
  xpReward: number;
}

export function CompleteButton({ moduleId, lessonId, xpReward }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [xpGained, setXpGained] = useState<number | null>(null);

  async function handleComplete() {
    setLoading(true);
    try {
      const result = await completeItem({ module_id: moduleId, lesson_id: lessonId });
      setXpGained(result.xp_awarded);
      setDone(true);
      router.refresh();
    } catch {
      // If already completed or unauthenticated, just mark done
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-5 py-3 text-success">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Leccion completada</span>
        {xpGained !== null && xpGained > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xp-gold font-bold">
            <Zap className="h-4 w-4" />
            +{xpGained} XP
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <CheckCircle className="h-5 w-5" />
      )}
      Marcar como completada
      <span className="ml-auto flex items-center gap-1 text-primary-foreground/70">
        <Zap className="h-4 w-4 text-xp-gold" />
        +{xpReward} XP
      </span>
    </button>
  );
}
