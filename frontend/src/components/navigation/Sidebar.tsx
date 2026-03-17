"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, BookOpen, Trophy, User, Zap, Flame } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";

const NAV_ITEMS = [
  { href: "/map", label: "Skill Tree", icon: Map },
  { href: "/modules", label: "Modulos", icon: BookOpen },
  { href: "/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: streak } = useStreak();

  return (
    <aside className="fixed left-0 top-24 z-20 hidden h-[calc(100vh-6rem)] w-56 flex-col border-r border-border bg-card md:flex">
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        {streak && (
          <div className="flex items-center gap-2 text-xs text-orange-400">
            <Flame className="h-3.5 w-3.5" />
            <span className="font-semibold">{streak.current_streak} días</span>
            <span className="text-muted-foreground">de racha</span>
            {streak.freeze_tokens > 0 && (
              <span className="ml-auto flex items-center gap-1 text-cyan-400" title="Freeze tokens: protegen tu racha">
                <span aria-hidden="true">&#x1f6e1;&#xfe0f;</span> {streak.freeze_tokens}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3 text-xp-gold" />
          <span>Fase 1 — Foundation</span>
        </div>
      </div>
    </aside>
  );
}
