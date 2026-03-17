import type { Badge } from "@/types";

interface Props {
  badges: Badge[];
}

const BADGE_ICONS: Record<string, string> = {
  first_blood: "\u{1FA78}",
  first_try: "\u26A1",
  streak_7: "\u{1F525}",
  streak_30: "\u{1F48E}",
  module_master: "\u{1F393}",
  speed_runner: "\u26A1",
  completionist: "\u{1F3C6}",
  social_learner: "\u{1F465}",
};

export function BadgeGrid({ badges }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {badges.map((badge) => {
        const unlocked = !!badge.awarded_at;
        return (
          <div
            key={badge.badge_id}
            title={`${badge.name}: ${badge.description}${badge.awarded_at ? `\nObtenido: ${new Date(badge.awarded_at).toLocaleDateString("es-AR")}` : ""}`}
            aria-label={`Badge: ${badge.name} - ${badge.description}. Estado: ${unlocked ? "Desbloqueado" : "Bloqueado"}`}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-opacity ${
              unlocked
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-zinc-900 opacity-40"
            }`}
          >
            <span className="text-2xl" role="img" aria-hidden="true">
              {BADGE_ICONS[badge.badge_id] ?? "\u{1F3C5}"}
            </span>
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
