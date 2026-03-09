import { useState } from "react";
import {
  TrendingUp, TrendingDown, Lightbulb,
  BarChart2, ArrowUp, ArrowDown, Flame,
} from "lucide-react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, Sector,
} from "recharts";
import {
  categoryData, monthlyData, insights, investments,
  totalExpenses, totalInvestments, monthlyIncome,
} from "../data/mockData";
import { useTheme } from "../context/ThemeContext";
import { useRealTime } from "../context/RealTimeContext";
import { LiveIndicator } from "../components/ui/LiveIndicator";
import { RadialProgressChart } from "../components/charts/RadialProgressChart";
import { StackedAreaChart } from "../components/charts/StackedAreaChart";
import { HeatmapCalendar } from "../components/charts/HeatmapCalendar";
import { SplitFlowChart } from "../components/charts/SplitFlowChart";

/* ─── Premium Glass Tooltip ──────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-xl"
      style={{
        background: "rgba(15,17,21,0.92)",
        border: "1px solid var(--iq-border-s)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
        backdropFilter: "blur(16px)",
      }}
    >
      {label && (
        <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </p>
      )}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color || "var(--iq-accent)" }} />
          <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{entry.name}</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--iq-text-1)", marginLeft: "auto", paddingLeft: "12px" }}>
            ₹{Number(entry.value).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Investment type colors ─────────────────────────────────────────── */
const INV_COLORS: Record<string, string> = {
  "Mutual Fund": "#00D4FF", "Stock": "#10B981", "FD": "#F59E0B", "PPF": "#8B5CF6", "Crypto": "#EC4899",
};
const aggregatedInvestments = investments
  .map((inv) => ({ name: inv.type, value: inv.amount, color: INV_COLORS[inv.type] || "#6B7280" }))
  .reduce((acc: any[], curr) => {
    const ex = acc.find((a) => a.name === curr.name);
    if (ex) { ex.value += curr.value; } else { acc.push({ ...curr }); }
    return acc;
  }, []);

const comparisonData = [
  { category: "Food",      jan: 6800, feb: 7370,  change: 8.4   },
  { category: "Transport", jan: 4100, feb: 4450,  change: 8.5   },
  { category: "Shopping",  jan: 2800, feb: 3549,  change: 26.8  },
  { category: "Entertain", jan: 799,  feb: 799,   change: 0     },
  { category: "Health",    jan: 2200, feb: 1920,  change: -12.7 },
  { category: "Utilities", jan: 2750, feb: 2847,  change: 3.5   },
  { category: "Education", jan: 2500, feb: 3149,  change: 26.0  },
  { category: "Travel",    jan: 0,    feb: 5500,  change: 100   },
];

/* ─── Active investment donut shape ──────────────────────────────────── */
const renderInvActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  const total = aggregatedInvestments.reduce((s: number, i: any) => s + i.value, 0);
  const pct = ((value / total) * 100).toFixed(1);
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 3} outerRadius={outerRadius + 9} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.95} style={{ filter: `drop-shadow(0 0 8px ${fill}60)` }} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 13} outerRadius={outerRadius + 17} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.45} />
      <text x={cx} y={cy - 12} textAnchor="middle" fontSize={10} fontWeight={700} style={{ fill: "var(--iq-text-1)" }}>{payload.name}</text>
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={14} fontWeight={700} style={{ fill }}>{pct}%</text>
    </g>
  );
};

/* ─── Custom SVG concentric income rings ─────────────────────────────── */
const ConcentricRings = () => {
  const savings = monthlyIncome - totalExpenses - totalInvestments;
  const rings = [
    { label: "Expenses",    pct: totalExpenses / monthlyIncome,    color: "#EF4444", r: 65, sw: 10 },
    { label: "Investments", pct: totalInvestments / monthlyIncome, color: "#10B981", r: 50, sw: 10 },
    { label: "Savings",     pct: savings / monthlyIncome,          color: "#00D4FF", r: 34, sw: 10 },
  ];
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {rings.map((ring, i) => {
        const c = 2 * Math.PI * ring.r;
        const dash = ring.pct * c;
        return (
          <g key={ring.label}>
            <circle cx={80} cy={80} r={ring.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={ring.sw} />
            <motion.circle
              cx={80} cy={80} r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.sw}
              strokeLinecap="round" strokeDashoffset={c / 4}
              initial={{ strokeDasharray: `0 ${c}` }}
              animate={{ strokeDasharray: `${dash} ${c - dash}` }}
              transition={{ delay: 0.4 + i * 0.22, duration: 1.3, ease: "easeOut" }}
              style={{ transformOrigin: "80px 80px", transform: "rotate(-90deg)" }}
            />
          </g>
        );
      })}
      <text x={80} y={73} textAnchor="middle" fontSize={9} style={{ fill: "var(--iq-text-4)" }}>Monthly</text>
      <text x={80} y={89} textAnchor="middle" fontSize={14} fontWeight={700} style={{ fill: "var(--iq-text-1)" }}>₹{(monthlyIncome / 1000).toFixed(0)}k</text>
    </svg>
  );
};

/* ─── Section Card wrapper ───────────────────────────────────────────── */
const Section = ({ title, badge, subtitle, children }: { title: string; badge?: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>{title}</h3>
        {badge && (
          <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", background: "var(--iq-accent-s)", color: "var(--iq-accent)", fontWeight: 700, border: "1px solid var(--iq-accent-b)" }}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginTop: "2px" }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

/* ─── Analytics Page ─────────────────────────────────────────────────── */
export function Analytics() {
  const [activeInvIndex, setActiveInvIndex] = useState<number>(0);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const { isRefreshing, secondsAgo } = useRealTime();

  const savingsRate = ((monthlyIncome - totalExpenses - totalInvestments) / monthlyIncome * 100).toFixed(1);
  const expenseChange = ((totalExpenses - monthlyData[4].expenses) / monthlyData[4].expenses * 100).toFixed(1);
  const gridStroke = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const savings = monthlyIncome - totalExpenses - totalInvestments;

  return (
    <div className="min-h-screen" style={{ background: "var(--iq-bg)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 lg:px-8 py-4 flex items-center justify-between"
        style={{ background: "var(--iq-header)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--iq-border)" }}
      >
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)" }}>Analytics</h1>
          <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Advanced charts · real-time insights</p>
        </div>
        <LiveIndicator secondsAgo={secondsAgo} isRefreshing={isRefreshing} />
      </div>

      <div className="px-4 lg:px-8 py-6 space-y-6">

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "vs Last Month",  value: `+${expenseChange}%`, sub: "Expenses increased",   color: "#EF4444", icon: TrendingUp,  bg: "rgba(239,68,68,0.1)" },
            { label: "Savings Rate",   value: `${savingsRate}%`,    sub: "Of income saved",       color: "#10B981", icon: TrendingDown, bg: "rgba(16,185,129,0.1)" },
            { label: "Top Category",   value: "Travel",             sub: "36.3% of spending",     color: "#14B8A6", icon: Flame,       bg: "rgba(20,184,166,0.1)" },
            { label: "Investment ROI", value: "+12.3%",             sub: "Avg portfolio return",  color: "#8B5CF6", icon: BarChart2,   bg: "rgba(139,92,246,0.1)" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-4"
              style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: metric.bg }}>
                <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
              </div>
              <p style={{ fontSize: "20px", fontWeight: 700, color: metric.color, lineHeight: 1.2 }}>{metric.value}</p>
              <p style={{ fontSize: "11px", color: "var(--iq-text-3)", marginTop: "2px" }}>{metric.label}</p>
              <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>{metric.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CHART 1: Radial Progress Budget Chart ─────────────── */}
        <Section title="Budget Utilization" badge="CHART 1" subtitle="Animated radial rings — expense vs category budgets">
          <RadialProgressChart />
        </Section>

        {/* AI Insights */}
        <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5" style={{ color: "#F59E0B" }} />
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>AI Insights</h3>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", background: "rgba(245,158,11,0.2)", color: "#F59E0B", fontWeight: 700 }}>NEW</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, i) => {
              const colors = {
                warning: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", text: "#F59E0B" },
                success: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", text: "#10B981" },
                info:    { bg: "var(--iq-accent-s)",   border: "var(--iq-accent-b)",   text: "var(--iq-accent)" },
              };
              const style = colors[insight.type as keyof typeof colors];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: style.bg, border: `1px solid ${style.border}` }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: style.text + "20" }}>
                    {insight.type === "success" ? <ArrowDown className="w-3 h-3" style={{ color: style.text }} /> : <ArrowUp className="w-3 h-3" style={{ color: style.text }} />}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--iq-text-2)", lineHeight: 1.5 }}>{insight.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── CHART 2: Gradient Donut + CHART 4: Stacked Area ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Chart 2: Gradient Donut — Investment Portfolio */}
          <Section title="Investment Portfolio" badge="CHART 2" subtitle="Gradient donut · hover for glow expansion">
            <div className="flex items-center gap-4">
              <PieChart width={155} height={155}>
                <Pie
                  data={aggregatedInvestments}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={4}
                  dataKey="value"
                  activeIndex={activeInvIndex}
                  activeShape={renderInvActiveShape}
                  onMouseEnter={(_, i) => setActiveInvIndex(i)}
                  onMouseLeave={() => setActiveInvIndex(0)}
                >
                  {aggregatedInvestments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={index === activeInvIndex ? 1 : 0.6} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const d = payload[0].payload;
                      return (
                        <div className="px-3 py-2 rounded-xl" style={{ background: "rgba(15,17,21,0.95)", border: `1px solid ${d.color}40`, boxShadow: `0 8px 32px ${d.color}30` }}>
                          <p style={{ fontSize: "12px", fontWeight: 600, color: d.color }}>{d.name}</p>
                          <p style={{ fontSize: "13px", color: "var(--iq-text-1)" }}>₹{d.value.toLocaleString("en-IN")}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
              <div className="flex-1 space-y-2">
                {aggregatedInvestments.map((inv, i) => (
                  <div
                    key={inv.name}
                    className="flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all"
                    style={{ background: activeInvIndex === i ? inv.color + "15" : "transparent" }}
                    onMouseEnter={() => setActiveInvIndex(i)}
                    onMouseLeave={() => setActiveInvIndex(0)}
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: inv.color }} />
                    <span style={{ fontSize: "12px", color: "var(--iq-text-3)", flex: 1 }}>{inv.name}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-2)" }}>₹{inv.value.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="pt-2 border-t" style={{ borderColor: "var(--iq-border-s)" }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "12px", color: "var(--iq-text-3)" }}>Total</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#10B981" }}>₹{totalInvestments.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Growth bars */}
            <div className="mt-4 space-y-2">
              {investments.map((inv) => (
                <div key={inv.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: "12px", color: "var(--iq-text-2)" }}>{inv.title}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#10B981" }}>+{inv.returns}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--iq-progress)" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(inv.returns * 1.5, 100)}%` }}
                      transition={{ delay: 0.3, duration: 0.9 }}
                      className="h-full rounded-full"
                      style={{ background: INV_COLORS[inv.type] || "#10B981" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Chart 4: Stacked Area */}
          <Section title="Expense · Investment · Savings" badge="CHART 4" subtitle="Toggle visibility · stacked area over 6 months">
            <StackedAreaChart />
          </Section>
        </div>

        {/* ── CHART 3: Monthly Comparison (improved area chart) ── */}
        <Section title="Monthly Comparison" badge="CHART 3" subtitle="Interactive multi-series area · hover dots · 6-month view">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {[
              { label: "Income",      color: "#00D4FF" },
              { label: "Expenses",    color: "#EF4444" },
              { label: "Investments", color: "#10B981" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span style={{ fontSize: "11px", color: "var(--iq-text-3)" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyData} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
              <defs>
                {[{ id: "expGrad", color: "#EF4444" }, { id: "invGrad", color: "#10B981" }, { id: "incGrad", color: "#00D4FF" }].map((g) => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={g.color} stopOpacity={0.35} />
                    <stop offset="60%" stopColor={g.color} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={g.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="month" tick={{ fill: "var(--iq-text-4)" as string, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--iq-text-4)" as string, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#00D4FF" strokeWidth={2.5} fill="url(#incGrad)" name="Income" dot={{ r: 3, fill: "#00D4FF", stroke: "var(--iq-bg)", strokeWidth: 1.5 }} activeDot={{ r: 6, fill: "#00D4FF", stroke: "var(--iq-bg)", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2.5} fill="url(#expGrad)" name="Expenses" dot={{ r: 3, fill: "#EF4444", stroke: "var(--iq-bg)", strokeWidth: 1.5 }} activeDot={{ r: 6, fill: "#EF4444", stroke: "var(--iq-bg)", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="investments" stroke="#10B981" strokeWidth={2.5} fill="url(#invGrad)" name="Investments" dot={{ r: 3, fill: "#10B981", stroke: "var(--iq-bg)", strokeWidth: 1.5 }} activeDot={{ r: 6, fill: "#10B981", stroke: "var(--iq-bg)", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Section>

        {/* ── Category MoM grouped bars ─────────────────────────── */}
        <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "4px" }}>Category Comparison (Jan vs Feb)</h3>
          <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "16px" }}>Grouped horizontal bars with gradient fill</p>
          <div className="flex gap-4 mb-3">
            {[{ label: "January", color: "#6B7280" }, { label: "February", color: "var(--iq-accent)" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span style={{ fontSize: "11px", color: "var(--iq-text-3)" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData} layout="vertical" barGap={3} barSize={7} margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="janGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6B7280" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#6B7280" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="febGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--iq-accent)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="var(--iq-accent)" stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--iq-text-4)" as string, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fill: "var(--iq-text-3)" as string, fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jan" fill="url(#janGrad)" radius={[0, 4, 4, 0]} name="January" />
              <Bar dataKey="feb" fill="url(#febGrad)" radius={[0, 4, 4, 0]} name="February" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-2">
            {comparisonData.map((item) => (
              <div key={item.category} className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: item.change > 0 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${item.change > 0 ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}` }}>
                {item.change > 0 ? <ArrowUp className="w-2.5 h-2.5" style={{ color: "#EF4444" }} /> : <ArrowDown className="w-2.5 h-2.5" style={{ color: "#10B981" }} />}
                <span style={{ fontSize: "10px", fontWeight: 700, color: item.change > 0 ? "#EF4444" : "#10B981" }}>{item.category} {Math.abs(item.change)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHART 5: Heatmap Calendar + CHART 6: Split Flow ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Chart 5: Heatmap Calendar */}
          <Section title="Daily Spend Heatmap" badge="CHART 5" subtitle="Feb 2026 · hover each day · color = intensity">
            <HeatmapCalendar />
          </Section>

          {/* Chart 6: Split Flow Diagram */}
          <Section title="Split Expense Flow" badge="CHART 6" subtitle="Network diagram · smart settlement arrows">
            <SplitFlowChart />
          </Section>
        </div>

        {/* ── Income Distribution — concentric SVG rings ─────────── */}
        <Section title="Income Distribution" subtitle={`How your ₹${monthlyIncome.toLocaleString("en-IN")} monthly income is allocated`}>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex-shrink-0">
              <ConcentricRings />
            </div>
            <div className="flex-1 min-w-[180px] space-y-4">
              {[
                { label: "Expenses",    value: totalExpenses,    pct: (totalExpenses / monthlyIncome * 100).toFixed(1),    color: "#EF4444" },
                { label: "Investments", value: totalInvestments, pct: (totalInvestments / monthlyIncome * 100).toFixed(1), color: "#10B981" },
                { label: "Savings",     value: savings,          pct: (savings / monthlyIncome * 100).toFixed(1),          color: "#00D4FF" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span style={{ fontSize: "13px", color: "var(--iq-text-2)" }}>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "13px", fontWeight: 700, color: item.color }}>{item.pct}%</span>
                      <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>₹{item.value.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--iq-progress)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ delay: 0.5, duration: 1 }} className="h-full rounded-full" style={{ background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}