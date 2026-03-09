import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { familyMembers, settlementData } from "../../data/mockData";

/* ── Node positions in 380×300 SVG ───────────────────────────────────── */
const POSITIONS: Record<string, { x: number; y: number }> = {
  "1": { x: 190, y: 65 },  // Alex  – top center
  "2": { x: 55,  y: 225 }, // Sarah – bottom left
  "3": { x: 325, y: 225 }, // Mike  – bottom right
  "4": { x: 190, y: 285 }, // Emma  – bottom center
};
const NODE_R = 32;

/* ── Cubic bezier path between two nodes ─────────────────────────────── */
function flowPath(from: string, to: string, offset = 0): string {
  const f = POSITIONS[from];
  const t = POSITIONS[to];
  const dx = t.x - f.x;
  const dy = t.y - f.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Shorten endpoints by NODE_R
  const sx = f.x + (dx / len) * (NODE_R + 4);
  const sy = f.y + (dy / len) * (NODE_R + 4);
  const ex = t.x - (dx / len) * (NODE_R + 4);
  const ey = t.y - (dy / len) * (NODE_R + 4);
  // Control points with slight curve
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const perp = { x: -(dy / len) * (30 + offset), y: (dx / len) * (30 + offset) };
  return `M ${sx} ${sy} Q ${mx + perp.x} ${my + perp.y} ${ex} ${ey}`;
}

/* ── Mid-point of bezier (approx at t=0.5) ───────────────────────────── */
function bezierMid(from: string, to: string, offset = 0): { x: number; y: number } {
  const f = POSITIONS[from];
  const t = POSITIONS[to];
  const dx = t.x - f.x;
  const dy = t.y - f.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const sx = f.x + (dx / len) * (NODE_R + 4);
  const sy = f.y + (dy / len) * (NODE_R + 4);
  const ex = t.x - (dx / len) * (NODE_R + 4);
  const ey = t.y - (dy / len) * (NODE_R + 4);
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const perp = { x: -(dy / len) * (30 + offset), y: (dx / len) * (30 + offset) };
  // Quadratic bezier at t=0.5
  const cx = mx + perp.x;
  const cy = my + perp.y;
  return {
    x: 0.25 * sx + 0.5 * cx + 0.25 * ex,
    y: 0.25 * sy + 0.5 * cy + 0.25 * ey,
  };
}

const STATUS_COLOR = { pending: "#F59E0B", settled: "#10B981" };
const STATUS_LABEL = { pending: "OWES", settled: "SETTLED" };

export function SplitFlowChart() {
  const [hovered, setHovered] = useState<string | null>(null);

  const memberMap = Object.fromEntries(familyMembers.map((m) => [m.id, m]));

  // Net amounts
  const pendingTotal = settlementData
    .filter((s) => s.status === "pending")
    .reduce((t, s) => t + s.amount, 0);

  return (
    <div>
      {/* Stats bar */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <div
          className="px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
          <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: 600 }}>
            ₹{pendingTotal.toLocaleString("en-IN")} pending settlement
          </span>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
          <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>
            ₹{settlementData.filter((s) => s.status === "settled").reduce((t, s) => t + s.amount, 0).toLocaleString("en-IN")} settled
          </span>
        </div>
      </div>

      {/* Flow diagram */}
      <div className="relative flex justify-center">
        <svg
          width="100%"
          viewBox="0 0 380 320"
          style={{ maxWidth: 480, overflow: "visible" }}
        >
          <defs>
            {/* Arrow markers */}
            <marker id="arrow-pending" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#F59E0B" />
            </marker>
            <marker id="arrow-settled" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#10B981" />
            </marker>
            {/* Glow filter */}
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background grid dots */}
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 10 }, (_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={20 + c * 38}
                cy={20 + r * 38}
                r={1}
                fill="rgba(255,255,255,0.06)"
              />
            ))
          )}

          {/* Flow arrows */}
          {settlementData.map((s, i) => {
            const path = flowPath(s.from, s.to, i * 8);
            const mid = bezierMid(s.from, s.to, i * 8);
            const isPending = s.status === "pending";
            const color = STATUS_COLOR[s.status as keyof typeof STATUS_COLOR];
            const isHov = hovered === `${s.from}-${s.to}`;

            return (
              <g key={i} onMouseEnter={() => setHovered(`${s.from}-${s.to}`)} onMouseLeave={() => setHovered(null)}>
                {/* Shadow glow path */}
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHov ? 8 : 4}
                  strokeOpacity={0.15}
                  strokeLinecap="round"
                />
                {/* Main arrow path */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHov ? 3 : 2}
                  strokeLinecap="round"
                  strokeDasharray={isPending ? "none" : "6 3"}
                  markerEnd={`url(#arrow-${s.status})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: i * 0.2, ease: "easeOut" }}
                />

                {/* Amount label at midpoint */}
                <AnimatePresence>
                  {isHov && (
                    <motion.g
                      key="label"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <rect
                        x={mid.x - 38} y={mid.y - 13}
                        width={76} height={26}
                        rx={6}
                        fill="rgba(15,17,21,0.95)"
                        stroke={color}
                        strokeWidth={1}
                      />
                      <text x={mid.x} y={mid.y - 2} textAnchor="middle" fontSize={9} style={{ fill: color, fontWeight: "700" }}>
                        {STATUS_LABEL[s.status as keyof typeof STATUS_LABEL]}
                      </text>
                      <text x={mid.x} y={mid.y + 9} textAnchor="middle" fontSize={10} style={{ fill: "white", fontWeight: "700" }}>
                        ₹{s.amount.toLocaleString("en-IN")}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Always-visible small badge */}
                {!isHov && (
                  <g>
                    <rect
                      x={mid.x - 22} y={mid.y - 9}
                      width={44} height={18}
                      rx={9}
                      fill="rgba(15,17,21,0.85)"
                      stroke={color + "50"}
                      strokeWidth={1}
                    />
                    <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={9} style={{ fill: color, fontWeight: "700" }}>
                      ₹{(s.amount / 1000).toFixed(1)}k
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Member nodes */}
          {familyMembers.map((m) => {
            const pos = POSITIONS[m.id];
            if (!pos) return null;
            const isAlex = m.id === "1";
            return (
              <g key={m.id}>
                {/* Outer glow ring */}
                {isAlex && (
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={NODE_R + 10}
                    fill="none"
                    stroke={m.color}
                    strokeWidth={1.5}
                    strokeOpacity={0.3}
                    animate={{ r: [NODE_R + 8, NODE_R + 14, NODE_R + 8], strokeOpacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {/* Main circle */}
                <circle
                  cx={pos.x} cy={pos.y} r={NODE_R}
                  fill={m.color + "20"}
                  stroke={m.color}
                  strokeWidth={isAlex ? 2.5 : 1.5}
                />
                {/* Avatar text */}
                <text
                  x={pos.x} y={pos.y - 4}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  style={{ fill: m.color }}
                >
                  {m.avatar}
                </text>
                {/* Name */}
                <text
                  x={pos.x} y={pos.y + 11}
                  textAnchor="middle"
                  fontSize={8}
                  style={{ fill: "var(--iq-text-3)" }}
                >
                  {m.name.split(" ")[0]}
                </text>
                {/* Role badge */}
                {isAlex && (
                  <g>
                    <rect
                      x={pos.x - 18} y={pos.y + 16}
                      width={36} height={13}
                      rx={6}
                      fill={m.color + "30"}
                      stroke={m.color + "50"}
                      strokeWidth={1}
                    />
                    <text
                      x={pos.x} y={pos.y + 25}
                      textAnchor="middle"
                      fontSize={7}
                      fontWeight={700}
                      style={{ fill: m.color }}
                    >
                      ADMIN
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Settlement table */}
      <div className="mt-4 space-y-2">
        {settlementData.map((s, i) => {
          const from = familyMembers.find((m) => m.id === s.from)!;
          const to = familyMembers.find((m) => m.id === s.to)!;
          const isPending = s.status === "pending";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: isPending ? "rgba(245,158,11,0.06)" : "rgba(16,185,129,0.06)",
                border: `1px solid ${isPending ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)"}`,
              }}
            >
              {/* From */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: from.color + "25", fontSize: "10px", fontWeight: 700, color: from.color }}
                >
                  {from.avatar}
                </div>
                <span style={{ fontSize: "12px", color: "var(--iq-text-2)", fontWeight: 500 }} className="truncate">
                  {from.name.split(" ")[0]}
                </span>
              </div>

              {/* Arrow + amount */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <span style={{ fontSize: "11px", fontWeight: 700, color: isPending ? "#F59E0B" : "#10B981" }}>
                    ₹{s.amount.toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-10 h-0.5 rounded" style={{ background: isPending ? "#F59E0B" : "#10B981" }} />
                    <span style={{ fontSize: "8px" }}>→</span>
                  </div>
                  <span
                    className="px-1.5 py-0.5 rounded-full"
                    style={{ fontSize: "9px", fontWeight: 700, background: isPending ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: isPending ? "#F59E0B" : "#10B981" }}
                  >
                    {isPending ? "PENDING" : "✓ SETTLED"}
                  </span>
                </div>
              </div>

              {/* To */}
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <span style={{ fontSize: "12px", color: "var(--iq-text-2)", fontWeight: 500 }} className="truncate">
                  {to.name.split(" ")[0]}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: to.color + "25", fontSize: "10px", fontWeight: 700, color: to.color }}
                >
                  {to.avatar}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Settle all CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))",
          border: "1px solid rgba(245,158,11,0.3)",
          color: "#F59E0B",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        <span>⚡</span>
        Settle All Pending — ₹{pendingTotal.toLocaleString("en-IN")}
      </motion.button>
    </div>
  );
}
