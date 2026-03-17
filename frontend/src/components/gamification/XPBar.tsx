interface Props {
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  xpToNextLevel: number;
}

export function XPBar({ totalXP, currentLevel, levelTitle, xpToNextLevel }: Props) {
  // XP needed for current level = total needed for next - remaining
  const xpForCurrentLevel = totalXP % (xpToNextLevel || 1);
  const progress = xpToNextLevel > 0 ? Math.min((xpForCurrentLevel / xpToNextLevel) * 100, 100) : 100;

  return (
    <div className="group relative flex items-center gap-3 border-b border-border bg-zinc-900 px-4 py-2">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs font-bold text-primary">Nv.{currentLevel}</span>
        <span className="text-xs text-muted-foreground">{levelTitle}</span>
      </div>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
        {totalXP.toLocaleString()} XP
      </span>

      {/* Tooltip on hover */}
      <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded-lg border border-border bg-zinc-800 p-3 shadow-xl opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
        <p className="whitespace-nowrap text-xs font-semibold text-foreground">
          Nivel {currentLevel} &middot; {levelTitle}
        </p>
        <p className="mt-1 whitespace-nowrap text-xs text-muted-foreground tabular-nums">
          {xpForCurrentLevel.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP para nivel {currentLevel + 1}
        </p>
      </div>
    </div>
  );
}
