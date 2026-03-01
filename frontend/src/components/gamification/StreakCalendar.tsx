import type { StreakDay } from "@/types";

interface Props {
  calendar: StreakDay[];
}

function getDayColor(xp: number): string {
  if (xp === 0) return "bg-zinc-800";
  if (xp < 100) return "bg-primary/30";
  return "bg-primary";
}

export function StreakCalendar({ calendar }: Props) {
  // Show last 30 days, filling up to 30 if fewer entries
  const days = calendar.slice(-30);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-10 gap-1">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.xp_earned} XP`}
            className={`h-6 w-full rounded-sm ${getDayColor(day.xp_earned)}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-zinc-800" /> Sin actividad
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/30" /> 1–99 XP
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" /> 100+ XP
        </span>
      </div>
    </div>
  );
}
