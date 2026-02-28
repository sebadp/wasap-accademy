"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Flame } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Flame className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground">AgentCraft</span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Salir
      </button>
    </header>
  );
}
