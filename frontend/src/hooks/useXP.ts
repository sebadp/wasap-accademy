"use client";

import { useState, useEffect, useCallback } from "react";
import { getXP } from "@/lib/api/client";
import type { XPResponse } from "@/types";

export function useXP() {
  const [data, setData] = useState<XPResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const xp = await getXP();
      setData(xp);
    } catch {
      // silently fail — user may not be logged in yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
