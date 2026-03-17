"use client";

import { useProgress } from "@/hooks/useProgress";
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

const W = 720;
const NODE_R = 28;
const TIER_GAP = 140;
const Y_PAD_TOP = 70;
const Y_PAD_BOT = 50;
const X_PAD = 90;
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

  const connections: { fromId: string; toId: string }[] = [];
  const seen = new Set<string>();

  for (let t = 0; t < tiers.length - 1; t++) {
    const upper = tiers[t].modules;
    const lower = tiers[t + 1].modules;
    addConnections(lower, upper, connections, seen);
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

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "\u2026" : s;
}

/* ── Module status helper ────────────────────────── */

type ModuleStatus = "completed" | "current" | "locked";

function getModuleStatus(
  moduleId: string,
  progressModules: { module_id: string; status: string; challenge_completed: boolean }[] | undefined,
): ModuleStatus {
  if (!progressModules) return "locked";
  const entry = progressModules.find((m) => m.module_id === moduleId);
  if (!entry) return "locked";
  if (entry.status === "completed") return "completed";
  if (entry.status === "in_progress" || entry.status === "available") return "current";
  return "locked";
}

/* ── Component ───────────────────────────────────── */

interface Props {
  modules: ModuleMeta[];
}

export function SkillTreeClient({ modules }: Props) {
  const { data: progress, loading } = useProgress();
  const { positions, connections, tierMeta } = buildLayout(modules);

  // Find the first current module (for the stronger pulse)
  const firstCurrentId = (() => {
    if (!progress?.modules) return null;
    // Walk modules in order (Foundation first) to find the first available/in_progress
    const sorted = [...modules].sort((a, b) => {
      const tierIdxA = TIER_ORDER.indexOf(a.tier as TierName);
      const tierIdxB = TIER_ORDER.indexOf(b.tier as TierName);
      if (tierIdxA !== tierIdxB) return tierIdxB - tierIdxA; // Foundation first (higher index)
      return a.order - b.order;
    });
    for (const mod of sorted) {
      const status = getModuleStatus(mod.id, progress.modules);
      if (status === "current") return mod.id;
    }
    return null;
  })();

  // Build set of completed module IDs for connection styling
  const completedSet = new Set<string>();
  if (progress?.modules) {
    for (const m of progress.modules) {
      if (m.status === "completed") completedSet.add(m.module_id);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Skill Tree</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {modules.length} modulos · {TIER_ORDER.length} tiers · Tu camino de novato a maestro
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

            {/* Stronger glow for completed nodes */}
            {TIER_ORDER.map((tier) => (
              <filter
                key={`glow-completed-${tier}`}
                id={`glow-completed-${tier}`}
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="8"
                  result="blur"
                />
                <feFlood
                  floodColor={TIER_THEME[tier].color}
                  floodOpacity="0.7"
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
            const lowerTier = a.y > b.y ? a.tier : b.tier;
            const bothCompleted = completedSet.has(fromId) && completedSet.has(toId);
            return (
              <path
                key={`${fromId}-${toId}`}
                d={bezierPath(a.x, a.y, b.x, b.y)}
                stroke={bothCompleted ? TIER_THEME[lowerTier].color : TIER_THEME[lowerTier].color}
                strokeWidth={bothCompleted ? 2.5 : 2}
                strokeOpacity={bothCompleted ? 0.6 : 0.15}
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
            const status = loading ? "locked" : getModuleStatus(mod.id, progress?.modules);
            const isCurrent = mod.id === firstCurrentId;
            const isCompleted = status === "completed";
            const isLocked = status === "locked";

            return (
              <a
                key={mod.id}
                href={isLocked ? undefined : `/modules/${mod.id}`}
                className={isLocked ? "cursor-default" : "skill-node-group"}
                style={isLocked ? { pointerEvents: "none" as const } : undefined}
              >
                {/* Outer glow ring (animated) */}
                {isCompleted && (
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_R + 6}
                    fill="none"
                    stroke={theme.color}
                    strokeWidth={1.5}
                    opacity={0.5}
                    className="skill-node-glow"
                  />
                )}

                {/* Current: stronger pulse with second ring */}
                {isCurrent && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r={NODE_R + 6}
                      fill="none"
                      stroke={theme.color}
                      strokeWidth={2}
                      opacity={0.6}
                      className="skill-node-current"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={NODE_R + 12}
                      fill="none"
                      stroke={theme.color}
                      strokeWidth={1}
                      opacity={0.3}
                      className="skill-node-current"
                    />
                  </>
                )}

                {/* Locked: dim glow ring */}
                {isLocked && (
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_R + 6}
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth={1}
                    opacity={0.15}
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_R}
                  fill={isLocked ? "#131320" : isCompleted ? theme.colorDim : theme.colorDim}
                  stroke={isLocked ? "#3f3f46" : theme.color}
                  strokeWidth={isCompleted ? 3 : isCurrent ? 2.5 : isLocked ? 1.5 : 2}
                  strokeOpacity={isLocked ? 0.3 : 1}
                  opacity={isLocked ? 0.3 : 1}
                  className="skill-node-circle"
                  filter={
                    isCompleted
                      ? `url(#glow-completed-${tier})`
                      : isCurrent
                        ? `url(#glow-${tier})`
                        : undefined
                  }
                />

                {/* Completed: checkmark icon */}
                {isCompleted && (
                  <path
                    d={`M ${x - 8} ${y} L ${x - 2} ${y + 6} L ${x + 9} ${y - 6}`}
                    fill="none"
                    stroke={theme.color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Current/Available: module number */}
                {!isCompleted && !isLocked && (
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={theme.color}
                    fontSize={14}
                    fontWeight={700}
                    fontFamily="var(--font-mono)"
                  >
                    {mod.order}
                  </text>
                )}

                {/* Locked: lock icon */}
                {isLocked && (
                  <g transform={`translate(${x - 8}, ${y - 10})`} opacity={0.4}>
                    {/* Lock body */}
                    <rect
                      x={2}
                      y={8}
                      width={12}
                      height={10}
                      rx={2}
                      fill="#3f3f46"
                      stroke="#52525b"
                      strokeWidth={1}
                    />
                    {/* Lock shackle */}
                    <path
                      d="M 5 8 V 5 C 5 2 11 2 11 5 V 8"
                      fill="none"
                      stroke="#52525b"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Module title (below node) */}
                <text
                  x={x}
                  y={y + NODE_R + 16}
                  textAnchor="middle"
                  fill={isLocked ? "#52525b" : "#e4e4e7"}
                  fontSize={10}
                  fontWeight={500}
                  opacity={isLocked ? 0.4 : 0.7}
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
                    fill={isCompleted ? "#34d399" : "#fbbf24"}
                    fontSize={9}
                    fontWeight={600}
                    fontFamily="var(--font-mono)"
                    opacity={isLocked ? 0.2 : 0.5}
                    className="skill-node-title"
                  >
                    {isCompleted ? `${mod.totalXP} XP ✓` : `${mod.totalXP} XP`}
                  </text>
                )}
              </a>
            );
          })}
        </svg>
      </div>

      {/* Legend — 3 states + tier colors */}
      <div className="mt-4 space-y-3">
        {/* Status legend */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="2" />
              <path d="M 4 7 L 6 9 L 10 5" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Completado
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="2" />
              <circle cx="7" cy="7" r="2" fill="#60a5fa" />
            </svg>
            En progreso
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="#131320" stroke="#3f3f46" strokeWidth="1.5" opacity="0.4" />
            </svg>
            Pendiente
          </span>
        </div>

        {/* Tier colors */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
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
