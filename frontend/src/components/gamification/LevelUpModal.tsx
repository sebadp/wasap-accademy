"use client";

import { useEffect, useCallback } from "react";

interface Props {
  level: number;
  title: string;
  onClose: () => void;
}

export function LevelUpModal({ level, title, onClose }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-heading"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-zinc-900 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-3xl">
          ⚡
        </div>
        <div className="text-center">
          <p
            id="level-up-heading"
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            ¡Subiste de nivel!
          </p>
          <p className="mt-1 text-3xl font-bold text-foreground">Nivel {level}</p>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 min-h-[44px] rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
