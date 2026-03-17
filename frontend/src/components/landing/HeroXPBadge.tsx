"use client";

import { Zap } from "lucide-react";

export default function HeroXPBadge() {
  return (
    <div className="animate-float absolute -right-4 -top-4 rounded-xl border border-xp-gold/30 bg-xp-gold/10 px-4 py-2 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-xp-gold" />
        <span className="text-sm font-bold text-xp-gold">+50 XP</span>
      </div>
    </div>
  );
}
