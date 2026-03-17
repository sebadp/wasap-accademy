"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Map, BookOpen, Trophy, User, Zap, Flame } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";

const NAV_ITEMS = [
  { href: "/map", label: "Skill Tree", icon: Map },
  { href: "/modules", label: "Modulos", icon: BookOpen },
  { href: "/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/profile", label: "Perfil", icon: User },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { data: streak } = useStreak();

  // Auto-close when pathname changes (navigation occurred)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-card shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navegacion movil"
      >
        {/* Header with close button */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              AgentCraft
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");
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
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-border p-4 space-y-2">
          {streak && (
            <div className="flex items-center gap-2 text-xs text-orange-400">
              <Flame className="h-3.5 w-3.5" />
              <span className="font-semibold">
                {streak.current_streak} dias
              </span>
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
            <span>Fase 1 -- Foundation</span>
          </div>
        </div>
      </aside>
    </>
  );
}
