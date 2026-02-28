"use client";

import { useState, useEffect, useCallback } from "react";
import { getStreak } from "@/lib/api/client";
import type { StreakResponse } from "@/types";

export function useStreak() {
  const [data, setData] = useState<StreakResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const streak = await getStreak();
      setData(streak);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
