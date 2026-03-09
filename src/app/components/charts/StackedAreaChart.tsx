import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { monthlyData, monthlyIncome } from "../../data/mockData";

// Derive "savings" from the monthly data
const enriched = monthlyData.map((d) => ({
  ...d,
  savings: Math.max(d.income - d.expenses - d.investments, 0),
}));

type SeriesKey = "expenses" | "investments" | "savings";

const SERIES = [
  { key: "expenses" as SeriesKey,    label: "Expenses",    color: "#EF4444", gradId: "stkExp" },
  { key: "investments" as SeriesKey, label: "Investments", color: "#10B981", gradId: "stkInv" },
  { key: "savings" as SeriesKey,     label: "Savings",     color: "#00D4FF", gradId: "stkSav" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-xl"
      style={{
        background: "rgba(15,17,21,0.92)",
        border: "1px solid var(--iq-border-s)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        backdropFilter: "blur(16px)",
      }}
    >
      <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.fill || entry.color }} />
          <span style={{ fontSize: "11px", color: "var(--iq-text-3)", textTransform: "capitalize" }}>{entry.name}</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--iq-text-1)", marginLeft: "auto", paddingLeft: "12px" }}>
            ₹{Number(entry.value).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

export function StackedAreaChart() {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    expenses: true,
    investments: true,
    savings: true,
  });

  const toggle = (key: SeriesKey) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      {/* Toggle controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SERIES.map((s) => (
          <motion.button
            key={s.key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggle(s.key)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
            style={{
              background: visible[s.key] ? s.color + "20" : "var(--iq-surface)",
              border: `1px solid ${visible[s.key] ? s.color + "40" : "var(--iq-border-s)"}`,
              opacity: visible[s.key] ? 1 : 0.5,
            }}
          >
            {/* Mini area swatch */}
            <svg width={18} height={12} viewBox="0 0 18 12">
              <defs>
                <linearGradient id={`sw-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <path d="M0 8 L4 4 L9 6 L14 2 L18 5 L18 12 L0 12 Z" fill={`url(#sw-${s.key})`} />
              <polyline points="0,8 4,4 9,6 14,2 18,5" stroke={s.color} strokeWidth={1.5} fill="none" />
            </svg>
            <span style={{ fontSize: "12px", fontWeight: 600, color: visible[s.key] ? s.color : "var(--iq-text-4)" }}>
              {s.label}
            </span>
            <div
              className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
              style={{
                borderColor: visible[s.key] ? s.color : "var(--iq-border-s)",
                background: visible[s.key] ? s.color : "transparent",
              }}
            >
              {visible[s.key] && (
                <svg width={8} height={6} viewBox="0 0 8 6">
                  <polyline points="1,3 3,5 7,1" stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </motion.button>
        ))}

        {/* Summary stats */}
        <div className="ml-auto flex items-center gap-4">
          <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Monthly Income ₹82k</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={enriched} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.5} />
                <stop offset="60%" stopColor={s.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--iq-text-4)" as string, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--iq-text-4)" as string, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="expenses"
            stackId="stack"
            stroke={SERIES[0].color}
            strokeWidth={2}
            fill={`url(#${SERIES[0].gradId})`}
            name="Expenses"
            hide={!visible.expenses}
            dot={{ r: 3, fill: SERIES[0].color, stroke: "var(--iq-bg)", strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: SERIES[0].color, stroke: "var(--iq-bg)", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="investments"
            stackId="stack"
            stroke={SERIES[1].color}
            strokeWidth={2}
            fill={`url(#${SERIES[1].gradId})`}
            name="Investments"
            hide={!visible.investments}
            dot={{ r: 3, fill: SERIES[1].color, stroke: "var(--iq-bg)", strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: SERIES[1].color, stroke: "var(--iq-bg)", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="savings"
            stackId="stack"
            stroke={SERIES[2].color}
            strokeWidth={2}
            fill={`url(#${SERIES[2].gradId})`}
            name="Savings"
            hide={!visible.savings}
            dot={{ r: 3, fill: SERIES[2].color, stroke: "var(--iq-bg)", strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: SERIES[2].color, stroke: "var(--iq-bg)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
