"use client";

import { useState, useRef, useCallback } from "react";
import { getXP } from "@/lib/api/client";

interface LevelUpState {
  leveledUp: boolean;
  newLevel: number;
  newTitle: string;
}

export function useLevelUp() {
  const prevLevelRef = useRef<number | null>(null);
  const [state, setState] = useState<LevelUpState | null>(null);

  const checkForLevelUp = useCallback(async () => {
    try {
      const xp = await getXP();
      const prevLevel = prevLevelRef.current;
      prevLevelRef.current = xp.current_level;

      if (prevLevel !== null && xp.current_level > prevLevel) {
        setState({
          leveledUp: true,
          newLevel: xp.current_level,
          newTitle: xp.level_title,
        });
      }

      return xp;
    } catch {
      return null;
    }
  }, []);

  const dismiss = useCallback(() => setState(null), []);

  return { levelUp: state, checkForLevelUp, dismiss };
}
