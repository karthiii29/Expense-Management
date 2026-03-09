import { motion } from "motion/react";
import { useRealTime } from "../../context/RealTimeContext";
import { categoryData } from "../../data/mockData";

const TOTAL_BUDGET = 34000;

const CATEGORY_BUDGETS: Record<string, number> = {
  "Food & Dining": 8000,
  "Transport":     5000,
  "Shopping":      4000,
  "Entertainment": 1500,
  "Health":        2500,
  "Utilities":     3500,
  "Education":     4000,
  "Travel":        6000,
};

function getBudgetColor(pct: number) {
  if (pct > 0.85) return "#EF4444";
  if (pct > 0.65) return "#F59E0B";
  return "#10B981";
}

interface MiniRingProps {
  label: string;
  spent: number;
  budget: number;
  color: string;
  delay: number;
  catColor: string;
}

function MiniRing({ label, spent, budget, color, delay, catColor }: MiniRingProps) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const pct = Math.min(spent / budget, 1);
  const overBudget = spent > budget;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 58, height: 58 }}>
        <svg width={58} height={58} viewBox="0 0 58 58">
          <circle cx={29} cy={29} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
          <motion.circle
            cx={29} cy={29} r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDashoffset={c / 4}
            initial={{ strokeDasharray: `0 ${c}` }}
            animate={{ strokeDasharray: `${pct * c} ${c - pct * c}` }}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
            style={{ transformOrigin: "29px 29px", transform: "rotate(-90deg)" }}
          />
          <text
            x={29} y={33}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            style={{ fill: color }}
          >
            {Math.round(pct * 100)}%
          </text>
        </svg>
        {overBudget && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: "#EF4444", fontSize: "9px", color: "#fff", fontWeight: 700 }}
          >
            !
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
        <span style={{ fontSize: "9px", color: "var(--iq-text-4)" }}>
          {label.split(" ")[0]}
        </span>
      </div>
      <span style={{ fontSize: "8px", color: "var(--iq-text-4)" }}>
        ₹{(spent / 1000).toFixed(1)}k / ₹{(budget / 1000).toFixed(0)}k
      </span>
    </div>
  );
}

export function RadialProgressChart() {
  const { totalLiveExpenses, pulseKey } = useRealTime();

  const mainR = 88;
  const mainC = 2 * Math.PI * mainR;
  const mainPct = Math.min(totalLiveExpenses / TOTAL_BUDGET, 1);
  const mainColor = getBudgetColor(mainPct);

  // Category totals from categoryData
  const catMap: Record<string, { value: number; color: string }> = {};
  categoryData.forEach((c) => { catMap[c.name] = { value: c.value, color: c.color }; });

  return (
    <div>
      {/* Main Budget Ring */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <svg width={210} height={210} viewBox="0 0 210 210">
            {/* Track */}
            <circle cx={105} cy={105} r={mainR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} />
            {/* Tick marks */}
            {[0, 25, 50, 75, 100].map((pct) => {
              const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
              const x1 = 105 + (mainR - 10) * Math.cos(angle);
              const y1 = 105 + (mainR - 10) * Math.sin(angle);
              const x2 = 105 + (mainR + 3) * Math.cos(angle);
              const y2 = 105 + (mainR + 3) * Math.sin(angle);
              return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />;
            })}
            {/* Progress arc */}
            <motion.circle
              key={`ring-${pulseKey}`}
              cx={105} cy={105} r={mainR}
              fill="none"
              stroke={mainColor}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDashoffset={mainC / 4}
              initial={{ strokeDasharray: `0 ${mainC}` }}
              animate={{ strokeDasharray: `${mainPct * mainC} ${mainC - mainPct * mainC}` }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{ transformOrigin: "105px 105px", transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${mainColor}60)` }}
            />
            {/* Glow dot at tip */}
            {(() => {
              const angle = mainPct * 2 * Math.PI - Math.PI / 2;
              const tx = 105 + mainR * Math.cos(angle);
              const ty = 105 + mainR * Math.sin(angle);
              return (
                <motion.circle
                  key={`dot-${pulseKey}`}
                  cx={tx} cy={ty} r={7}
                  fill={mainColor}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 6px ${mainColor})` }}
                />
              );
            })()}
            {/* Center text */}
            <text x={105} y={92} textAnchor="middle" fontSize={30} fontWeight={700} style={{ fill: mainColor }}>
              {Math.round(mainPct * 100)}%
            </text>
            <text x={105} y={112} textAnchor="middle" fontSize={11} style={{ fill: "var(--iq-text-3)" }}>
              ₹{(totalLiveExpenses / 1000).toFixed(1)}k spent
            </text>
            <text x={105} y={127} textAnchor="middle" fontSize={10} style={{ fill: "var(--iq-text-4)" }}>
              of ₹{(TOTAL_BUDGET / 1000).toFixed(0)}k budget
            </text>
          </svg>
        </div>

        {/* Budget status bar */}
        <div className="w-full flex items-center justify-between mt-2">
          <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>₹0</span>
          <div
            className="flex-1 h-1.5 mx-2 rounded-full overflow-hidden"
            style={{ background: "var(--iq-progress)" }}
          >
            <motion.div
              key={`bar-${pulseKey}`}
              initial={{ width: 0 }}
              animate={{ width: `${mainPct * 100}%` }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: mainColor }}
            />
          </div>
          <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>₹{(TOTAL_BUDGET / 1000).toFixed(0)}k</span>
        </div>

        {/* Status badge */}
        <div
          className="mt-3 px-3 py-1 rounded-full flex items-center gap-2"
          style={{
            background: mainColor + "15",
            border: `1px solid ${mainColor}30`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: mainColor, boxShadow: `0 0 6px ${mainColor}` }}
          />
          <span style={{ fontSize: "12px", fontWeight: 600, color: mainColor }}>
            {mainPct > 0.85
              ? "Over Budget! ⚠️"
              : mainPct > 0.65
              ? "Caution — 65%+ used"
              : "On Track 🎯"}
          </span>
        </div>
      </div>

      {/* Category Mini Rings */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(CATEGORY_BUDGETS).map(([cat, budget], i) => {
          const spent = catMap[cat]?.value ?? 0;
          const catColor = catMap[cat]?.color ?? "#6B7280";
          const pct = spent / budget;
          return (
            <MiniRing
              key={cat}
              label={cat}
              spent={spent}
              budget={budget}
              color={getBudgetColor(pct)}
              catColor={catColor}
              delay={0.1 * i}
            />
          );
        })}
      </div>
    </div>
  );
}