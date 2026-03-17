"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface LessonProgressRow {
  module_id: string;
  lesson_id: string;
  status: string;
  completed_at: string | null;
}

interface ModuleProgressRow {
  module_id: string;
  status: string;
  challenge_completed: boolean;
}

export interface UserProgress {
  lessons: LessonProgressRow[];
  modules: ModuleProgressRow[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export function useProgress() {
  const [data, setData] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/progress`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const progress = (await res.json()) as UserProgress;
        setData(progress);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener("progress-updated", handleUpdate);
    return () => window.removeEventListener("progress-updated", handleUpdate);
  }, [refresh]);

  return { data, loading, refresh };
}
