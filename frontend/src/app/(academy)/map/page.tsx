import { getModuleList } from "@/lib/content/loader";
import type { ModuleMeta } from "@/lib/content/types";
import { Zap } from "lucide-react";

/* ── Tier config ─────────────────────────────────── */

const TIER_ORDER = [
  "Production",
  "Specialist",
  "Expert",
  "Advanced",
  "Intermediate",
  "Core",
  "Foundation",
] as const;

type TierName = (typeof TIER_ORDER)[number];

const TIER_THEME: Record<TierName, { color: string; colorDim: string; label: string }> = {
  Foundation:   { color: "#34d399", colorDim: "rgba(52,211,153,0.15)",  label: "1 · Foundation" },
  Core:         { color: "#60a5fa", colorDim: "rgba(96,165,250,0.15)",  label: "2 · Core" },
  Intermediate: { color: "#22d3ee", colorDim: "rgba(34,211,238,0.15)",  label: "3 · Intermediate" },
  Advanced:     { color: "#a78bfa", colorDim: "rgba(167,139,250,0.15)", label: "4 · Advanced" },
  Expert:       { color: "#fb923c", colorDim: "rgba(251,146,60,0.15)",  label: "5 · Expert" },
  Specialist:   { color: "#fbbf24", colorDim: "rgba(251,191,36,0.15)",  label: "6 · Specialist" },
  Production:   { color: "#f87171", colorDim: "rgba(248,113,113,0.15)", label: "7 · Production" },
};

/* ── Layout constants ────────────────────────────── */

const W = 720;           // SVG width
const NODE_R = 28;       // node circle radius
const TIER_GAP = 140;    // vertical gap between tiers
const Y_PAD_TOP = 70;    // top padding
const Y_PAD_BOT = 50;    // bottom padding
const X_PAD = 90;        // side padding
const H = Y_PAD_TOP + (TIER_ORDER.length - 1) * TIER_GAP + Y_PAD_BOT;

/* ── Position calculations ───────────────────────── */

interface NodePos {
  x: number;
  y: number;
  tier: TierName;
  mod: ModuleMeta;
}

function buildLayout(modules: ModuleMeta[]) {
  const tiers = TIER_ORDER.map((tierName) => ({
    name: tierName,
    modules: modules
      .filter((m) => m.tier === tierName)
      .sort((a, b) => a.order - b.order),
  }));

  // Calculate node positions (top-to-bottom: Production → Foundation)
  const positions = new Map<string, NodePos>();
  const tierMeta: { name: TierName; y: number; moduleIds: string[] }[] = [];

  tiers.forEach((tier, idx) => {
    const y = Y_PAD_TOP + idx * TIER_GAP;
    const n = tier.modules.length;
    const avail = W - 2 * X_PAD;
    const ids: string[] = [];

    tier.modules.forEach((mod, i) => {
      const x = n === 1 ? W / 2 : X_PAD + (i * avail) / (n - 1);
      positions.set(mod.id, { x, y, tier: tier.name, mod });
      ids.push(mod.id);
    });

    tierMeta.push({ name: tier.name, y, moduleIds: ids });
  });

  // Calculate connections (bidirectional nearest-neighbor)
  const connections: { fromId: string; toId: string }[] = [];
  const seen = new Set<string>();

  for (let t = 0; t < tiers.length - 1; t++) {
    const upper = tiers[t].modules;
    const lower = tiers[t + 1].modules;

    // Lower → Upper
    addConnections(lower, upper, connections, seen);
    // Upper → Lower (reversed, to fill gaps)
    addConnections(upper, lower, connections, seen);
  }

  return { positions, connections, tierMeta };
}

function addConnections(
  from: ModuleMeta[],
  to: ModuleMeta[],
  out: { fromId: string; toId: string }[],
  seen: Set<string>,
) {
  from.forEach((fMod, i) => {
    const norm = from.length === 1 ? 0.5 : i / (from.length - 1);
    const target = norm * (to.length - 1);
    const lo = Math.floor(target);
    const hi = Math.ceil(target);

    for (const idx of [lo, hi]) {
      const key = [fMod.id, to[idx].id].sort().join("-");
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ fromId: fMod.id, toId: to[idx].id });
      }
    }
  });
}

/* ── SVG helpers ─────────────────────────────────── */

function bezierPath(x1: number, y1: number, x2: number, y2: number) {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

/* ── Component ───────────────────────────────────── */

export default function SkillTreePage() {
  const modules = getModuleList();
  const { positions, connections, tierMeta } = buildLayout(modules);

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Skill Tree</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          23 módulos · 7 tiers · Tu camino de novato a maestro
        </p>
      </div>

      {/* Tree */}
      <div className="w-full overflow-x-auto pb-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto block w-full min-w-[480px] max-w-[720px]"
          role="img"
          aria-label="Skill tree de AgentCraft"
        >
          <defs>
            {/* Glow filters per tier */}
            {TIER_ORDER.map((tier) => (
              <filter
                key={`glow-${tier}`}
                id={`glow-${tier}`}
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="6"
                  result="blur"
                />
                <feFlood
                  floodColor={TIER_THEME[tier].color}
                  floodOpacity="0.5"
                  result="color"
                />
                <feComposite
                  in="color"
                  in2="blur"
                  operator="in"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          {/* ── Tier horizontal bands (subtle) ── */}
          {tierMeta.map((tier) => (
            <rect
              key={`band-${tier.name}`}
              x={0}
              y={tier.y - TIER_GAP / 2 + 10}
              width={W}
              height={TIER_GAP - 20}
              rx={8}
              fill={TIER_THEME[tier.name].colorDim}
              opacity={0.3}
            />
          ))}

          {/* ── Connection lines ── */}
          {connections.map(({ fromId, toId }) => {
            const a = positions.get(fromId)!;
            const b = positions.get(toId)!;
            // Use the lower tier's color
            const lowerTier = a.y > b.y ? a.tier : b.tier;
            return (
              <path
                key={`${fromId}-${toId}`}
                d={bezierPath(a.x, a.y, b.x, b.y)}
                stroke={TIER_THEME[lowerTier].color}
                strokeWidth={2}
                strokeOpacity={0.2}
                fill="none"
                className="skill-tree-connection"
              />
            );
          })}

          {/* ── Tier labels (above each band) ── */}
          {tierMeta.map((tier) => (
            <text
              key={`label-${tier.name}`}
              x={W / 2}
              y={tier.y - TIER_GAP / 2 + 20}
              textAnchor="middle"
              fill={TIER_THEME[tier.name].color}
              fontSize={10}
              fontWeight={600}
              fontFamily="var(--font-mono)"
              opacity={0.4}
            >
              {TIER_THEME[tier.name].label}
            </text>
          ))}

          {/* ── Nodes ── */}
          {Array.from(positions.values()).map(({ x, y, tier, mod }) => {
            const theme = TIER_THEME[tier];
            const hasContent = mod.lessons.length > 0;

            return (
              <a
                key={mod.id}
                href={`/modules/${mod.id}`}
                className="skill-node-group"
              >
                {/* Outer glow ring (animated) */}
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={theme.color}
                  strokeWidth={1.5}
                  opacity={0.3}
                  className="skill-node-glow"
                />

                {/* Main circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_R}
                  fill={hasContent ? theme.colorDim : "#131320"}
                  stroke={theme.color}
                  strokeWidth={hasContent ? 2.5 : 1.5}
                  strokeOpacity={hasContent ? 1 : 0.3}
                  className="skill-node-circle"
                  filter={hasContent ? `url(#glow-${tier})` : undefined}
                />

                {/* Module number */}
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hasContent ? theme.color : "#71717a"}
                  fontSize={14}
                  fontWeight={700}
                  fontFamily="var(--font-mono)"
                >
                  {mod.order}
                </text>

                {/* Module title (below node) */}
                <text
                  x={x}
                  y={y + NODE_R + 16}
                  textAnchor="middle"
                  fill="#e4e4e7"
                  fontSize={10}
                  fontWeight={500}
                  opacity={0.7}
                  className="skill-node-title"
                >
                  {truncate(mod.title, 20)}
                </text>

                {/* XP badge (below title) */}
                {mod.totalXP > 0 && (
                  <text
                    x={x}
                    y={y + NODE_R + 30}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize={9}
                    fontWeight={600}
                    fontFamily="var(--font-mono)"
                    opacity={0.5}
                    className="skill-node-title"
                  >
                    {mod.totalXP} XP
                  </text>
                )}
              </a>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        {TIER_ORDER.slice().reverse().map((tier) => (
          <span key={tier} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: TIER_THEME[tier].color }}
            />
            {tier}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 flex justify-center gap-8 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-xp-gold" />
          {modules.reduce((s, m) => s + m.totalXP, 0).toLocaleString()} XP total
        </span>
        <span>
          {modules.reduce((s, m) => s + m.lessons.length, 0)} lecciones
        </span>
      </div>
    </div>
  );
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
