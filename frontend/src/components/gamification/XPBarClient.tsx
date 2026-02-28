"use client";

import { useXP } from "@/hooks/useXP";
import { XPBar } from "./XPBar";

export function XPBarClient() {
  const { data } = useXP();

  if (!data) return <div className="h-10 border-b border-border bg-zinc-900" />;

  return (
    <XPBar
      totalXP={data.total_xp}
      currentLevel={data.current_level}
      levelTitle={data.level_title}
      xpToNextLevel={data.xp_to_next_level}
    />
  );
}
