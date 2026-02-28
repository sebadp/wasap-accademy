"use client";

import { useEffect, useState } from "react";

interface Props {
  amount: number;
  onDone?: () => void;
}

export function XPEvent({ amount, onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <span
      className="pointer-events-none inline-flex animate-bounce items-center gap-0.5 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-400"
    >
      +{amount} XP
    </span>
  );
}
