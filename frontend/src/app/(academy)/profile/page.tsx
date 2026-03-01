"use client";

import { useXP } from "@/hooks/useXP";
import { useStreak } from "@/hooks/useStreak";
import { useBadges } from "@/hooks/useBadges";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { StreakCalendar } from "@/components/gamification/StreakCalendar";

export default function ProfilePage() {
  const { data: xp, loading: xpLoading } = useXP();
  const { data: streak, loading: streakLoading } = useStreak();
  const { data: badges, loading: badgesLoading } = useBadges();

  const loading = xpLoading || streakLoading || badgesLoading;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
          ?
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Mi Perfil</h1>
          {xp && (
            <p className="text-sm text-muted-foreground">
              Nivel {xp.current_level} · {xp.level_title}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      {xp && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="XP Total" value={xp.total_xp.toLocaleString()} color="text-yellow-400" />
          <StatCard label="Nivel" value={String(xp.current_level)} color="text-primary" />
          <StatCard
            label="Racha actual"
            value={streak ? `${streak.current_streak} días` : "—"}
            color="text-orange-400"
          />
          <StatCard
            label="Racha máxima"
            value={streak ? `${streak.longest_streak} días` : "—"}
            color="text-emerald-400"
          />
        </div>
      )}

      {/* Badges */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Badges</h2>
        {badges.length > 0 ? (
          <BadgeGrid badges={badges} />
        ) : (
          <p className="text-sm text-muted-foreground">Aún no obtuviste badges. ¡Completá challenges!</p>
        )}
      </section>

      {/* Streak calendar */}
      {streak && streak.calendar.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Actividad (últimos 30 días)</h2>
          <StreakCalendar calendar={streak.calendar} />
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
