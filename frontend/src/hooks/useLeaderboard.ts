"use client";

import { useState, useEffect, useCallback } from "react";
import { getLeaderboard } from "@/lib/api/client";
import type { LeaderboardEntry } from "@/types";

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const entries = await getLeaderboard();
      setData(entries);
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
