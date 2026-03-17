"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Flame, Menu } from "lucide-react";
import MobileDrawer from "./MobileDrawer";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Flame className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">AgentCraft</span>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={handleCloseDrawer} />
    </>
  );
}
