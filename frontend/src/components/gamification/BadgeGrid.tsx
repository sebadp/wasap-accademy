import type { Badge } from "@/types";

interface Props {
  badges: Badge[];
}

const BADGE_ICONS: Record<string, string> = {
  first_blood: "🩸",
  first_try: "⚡",
  streak_7: "🔥",
  streak_30: "💎",
  module_master: "🎓",
  speed_runner: "⚡",
  completionist: "🏆",
  social_learner: "👥",
};

export function BadgeGrid({ badges }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {badges.map((badge) => {
        const unlocked = !!badge.awarded_at;
        return (
          <div
            key={badge.badge_id}
            title={`${badge.name}: ${badge.description}${badge.awarded_at ? `\nObtenido: ${new Date(badge.awarded_at).toLocaleDateString("es-AR")}` : ""}`}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-opacity ${
              unlocked
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-zinc-900 opacity-40"
            }`}
          >
            <span className="text-2xl">{BADGE_ICONS[badge.badge_id] ?? "🏅"}</span>
            <span className={`text-xs font-semibold leading-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
              {badge.name}
            </span>
            {unlocked && badge.awarded_at && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(badge.awarded_at).toLocaleDateString("es-AR")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
