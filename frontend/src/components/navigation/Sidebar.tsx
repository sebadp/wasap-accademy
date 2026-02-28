"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, BookOpen, Trophy, User, Zap } from "lucide-react";

const NAV_ITEMS = [
  { href: "/map", label: "Skill Tree", icon: Map },
  { href: "/modules", label: "Modulos", icon: BookOpen },
  { href: "/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 z-20 flex h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-border bg-card">
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3 text-xp-gold" />
          <span>Fase 1 — Foundation</span>
        </div>
      </div>
    </aside>
  );
}
