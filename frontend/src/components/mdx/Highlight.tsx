type Color = "yellow" | "purple" | "cyan" | "green";

const COLORS: Record<Color, string> = {
  yellow: "bg-yellow-400/20 text-yellow-200",
  purple: "bg-purple-400/20 text-purple-200",
  cyan:   "bg-cyan-400/20 text-cyan-200",
  green:  "bg-emerald-400/20 text-emerald-200",
};

export function Highlight({ color = "yellow", children }: { color?: Color; children: React.ReactNode }) {
  return (
    <mark className={`rounded px-1 py-0.5 font-medium not-italic ${COLORS[color]}`}>
      {children}
    </mark>
  );
}
