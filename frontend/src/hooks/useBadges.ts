"use client";

import { useState, useEffect, useCallback } from "react";
import { getBadges } from "@/lib/api/client";
import type { Badge } from "@/types";

export function useBadges() {
  const [data, setData] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const badges = await getBadges();
      setData(badges);
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
