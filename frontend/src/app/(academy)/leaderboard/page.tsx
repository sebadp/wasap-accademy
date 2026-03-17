"use client";

import { useEffect, useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Crown, ChevronUp, ChevronDown, Minus } from "lucide-react";
import type { LeaderboardEntry } from "@/types";

const LEVEL_TITLES: Record<number, string> = {
  1: "Novice",
  2: "Apprentice",
  3: "Student",
  4: "Practitioner",
  5: "Builder",
  6: "Engineer",
  7: "Architect",
  8: "Master",
  9: "Grandmaster",
  10: "Sage",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function LeaderboardPage() {
  const { data, loading } = useLeaderboard();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUsername(
          user.user_metadata?.username ?? user.email ?? null
        );
      }
    });
  }, []);

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Trophy className="h-12 w-12" />
        <p className="text-sm">Nadie en el ranking todavía</p>
      </div>
    );
  }

  const top3 = data.slice(0, 3);
  const rest = data.slice(3, 20);
  const maxXP = data.length > 0 ? data[0].total_xp : 1;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ranking</h1>
        <p className="text-sm text-muted-foreground">
          Los mejores estudiantes de la academia
        </p>
      </div>

      {/* Podium */}
      <Podium entries={top3} currentUsername={currentUsername} />

      {/* Rest of the grid */}
      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((entry, i) => (
            <RankCard
              key={entry.username}
              entry={entry}
              position={i + 4}
              isCurrentUser={entry.username === currentUsername}
              maxXP={maxXP}
              isOdd={i % 2 !== 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Podium ────────────────────────────────────────────── */

function Podium({
  entries,
  currentUsername,
}: {
  entries: LeaderboardEntry[];
  currentUsername: string | null;
}) {
  // Order: 2nd | 1st | 3rd
  const ordered = [entries[1], entries[0], entries[2]].filter(Boolean);
  const positionMap = [2, 1, 3];
  const heights = ["h-36 sm:h-44", "h-44 sm:h-56", "h-32 sm:h-40"];
  const widths = ["w-28 sm:w-36", "w-32 sm:w-40", "w-28 sm:w-36"];

  const styles: Record<
    number,
    { border: string; bg: string; avatarBg: string }
  > = {
    1: {
      border: "border-yellow-500/50",
      bg: "bg-yellow-500/10",
      avatarBg: "bg-yellow-500/20",
    },
    2: {
      border: "border-zinc-400/50",
      bg: "bg-zinc-400/10",
      avatarBg: "bg-zinc-400/20",
    },
    3: {
      border: "border-amber-700/50",
      bg: "bg-amber-700/10",
      avatarBg: "bg-amber-700/20",
    },
  };

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {ordered.map((entry, i) => {
        const pos = positionMap[i];
        const style = styles[pos];
        const isMe = entry.username === currentUsername;

        return (
          <div
            key={entry.username}
            className={`${heights[i]} ${widths[i]} flex flex-col items-center justify-end gap-2 rounded-xl border ${style.border} ${style.bg} p-3 transition-colors ${isMe ? "ring-2 ring-primary/40" : ""}`}
          >
            {/* Avatar */}
            <div className="relative">
              {pos === 1 && (
                <Crown className="absolute -top-4 left-1/2 h-5 w-5 -translate-x-1/2 text-yellow-400" />
              )}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${style.avatarBg} ${pos === 1 ? "sm:h-14 sm:w-14 sm:text-base" : ""}`}
              >
                {getInitials(entry.display_name || entry.username)}
              </div>
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                {entry.display_name || entry.username}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                Nv.{entry.current_level} ·{" "}
                {LEVEL_TITLES[entry.current_level] ?? "Novice"}
              </p>
            </div>

            {/* XP */}
            <p className="text-sm font-bold text-xp-gold">
              {entry.total_xp.toLocaleString()} XP
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Rank Card ─────────────────────────────────────────── */

function RankCard({
  entry,
  position,
  isCurrentUser,
  maxXP,
  isOdd,
}: {
  entry: LeaderboardEntry;
  position: number;
  isCurrentUser: boolean;
  maxXP: number;
  isOdd: boolean;
}) {
  const levelAccent =
    entry.current_level >= 9
      ? "border-l-4 border-l-accent"
      : entry.current_level >= 7
        ? "border-l-4 border-l-primary"
        : "";

  const bgClass = isCurrentUser
    ? "border-primary/30 bg-primary/10"
    : isOdd
      ? "bg-zinc-900/50"
      : "bg-card";

  // Static position change indicator (placeholder for future real data)
  const changeIndicators = [
    { icon: ChevronUp, color: "text-emerald-400" },
    { icon: Minus, color: "text-muted-foreground" },
    { icon: ChevronDown, color: "text-red-400" },
  ];
  // Use a deterministic "random" based on position to vary the indicators
  const changeIdx = position % 3;
  const ChangeIcon = changeIndicators[changeIdx].icon;
  const changeColor = changeIndicators[changeIdx].color;

  return (
    <div
      className={`rounded-xl border border-border px-4 py-3 ${levelAccent} ${bgClass}`}
    >
      <div className="flex items-center gap-3">
        {/* Position + change indicator */}
        <div className="flex shrink-0 flex-col items-center gap-0.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">
            {position}
          </span>
          <ChangeIcon className={`h-3 w-3 ${changeColor}`} />
        </div>

        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
          {getInitials(entry.display_name || entry.username)}
        </div>

        {/* Name + Level */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {entry.display_name || entry.username}
          </p>
          <p className="text-xs text-muted-foreground">
            Nv.{entry.current_level} ·{" "}
            {LEVEL_TITLES[entry.current_level] ?? "Novice"}
          </p>
        </div>

        {/* XP */}
        <p className="shrink-0 text-sm font-bold text-xp-gold">
          {entry.total_xp.toLocaleString()} XP
        </p>
      </div>

      {/* Mini XP progress bar (relative to #1 player) */}
      <div className="mt-1 h-0.5 w-full rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-xp-gold/40"
          style={{ width: `${(entry.total_xp / maxXP) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────── */

function LeaderboardSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-32 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-64 animate-pulse rounded bg-secondary" />
      </div>

      {/* Podium skeleton */}
      <div className="flex items-end justify-center gap-3 sm:gap-6">
        <div className="h-36 w-28 animate-pulse rounded-xl bg-secondary sm:h-44 sm:w-36" />
        <div className="h-44 w-32 animate-pulse rounded-xl bg-secondary sm:h-56 sm:w-40" />
        <div className="h-32 w-28 animate-pulse rounded-xl bg-secondary sm:h-40 sm:w-36" />
      </div>

      {/* Card skeletons */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-secondary"
          />
        ))}
      </div>
    </div>
  );
}
