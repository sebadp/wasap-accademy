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
    <div className="flex items-center gap-3 border-b border-border bg-zinc-900 px-4 py-2">
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
    </div>
  );
}
