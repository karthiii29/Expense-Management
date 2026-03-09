import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank,
  Bell, Search, Users, ChevronRight, Banknote, BarChart2,
  Plus, RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Line,
  Sector,
} from "recharts";
import { useRealTime } from "../context/RealTimeContext";
import { CountUp } from "../components/ui/CountUp";
import { LiveIndicator, SkeletonCard } from "../components/ui/LiveIndicator";
import { TimelineChart } from "../components/charts/TimelineChart";
import {
  categoryData, monthlyData,
  familyMembers, getCategoryIcon, getCategoryColor,
  monthlyIncome,
} from "../data/mockData";
import { useTheme } from "../context/ThemeContext";

/* ─── Premium Tooltip ────────────────────────────────────────────────── */
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

/* ─── Active Shape for Category Donut ───────────────────────────────── */
const renderCategoryActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 9}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
        style={{ filter: `drop-shadow(0 0 8px ${fill}60)` }}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 13}
        outerRadius={outerRadius + 17}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.45}
      />
      <text x={cx} y={cy - 11} textAnchor="middle" fontSize={10} fontWeight={700} style={{ fill: "var(--iq-text-1)" }}>
        {payload.name.split(" ")[0]}
      </text>
      <text x={cx} y={cy + 7} textAnchor="middle" fontSize={13} fontWeight={700} style={{ fill }}>
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

/* ─── Stat Card with CountUp + pulse on refresh ─────────────────────── */
const StatCard = ({
  title, value, subtitle, icon: Icon, color, trend, trendUp, isRefreshing,
  prefix = "₹", suffix = "", decimals = 0,
}: {
  title: string; value: number; subtitle: string;
  icon: any; color: string; trend?: string; trendUp?: boolean; isRefreshing?: boolean;
  prefix?: string; suffix?: string; decimals?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="relative overflow-hidden rounded-2xl p-5"
    style={{
      background: "var(--iq-surface)",
      border: isRefreshing ? `1px solid ${color}40` : "1px solid var(--iq-border)",
      backdropFilter: "blur(20px)",
      transition: "border-color 0.4s",
    }}
  >
    {/* Refresh pulse overlay */}
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          key="pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}15 0%, transparent 70%)` }}
        />
      )}
    </AnimatePresence>

    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ background: color, transform: "translate(20%, -20%)" }} />

    <div className="flex items-start justify-between mb-4 relative">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "20", border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: trendUp ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${trendUp ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}
        >
          {trendUp ? <TrendingUp className="w-3 h-3" style={{ color: "#EF4444" }} /> : <TrendingDown className="w-3 h-3" style={{ color: "#10B981" }} />}
          <span style={{ fontSize: "11px", fontWeight: 600, color: trendUp ? "#EF4444" : "#10B981" }}>{trend}</span>
        </div>
      )}
    </div>
    <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "4px" }}>{title}</p>
    <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--iq-text-1)", lineHeight: 1.2 }}>
      <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
    </p>
    <p style={{ fontSize: "12px", color: "var(--iq-text-3)", marginTop: "4px" }}>{subtitle}</p>
  </motion.div>
);

/* ─── Dashboard Page ─────────────────────────────────────────────────── */
export function Dashboard() {
  const { openAddExpense } = useOutletContext<{ openAddExpense: () => void }>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  const {
    liveExpenses, totalLiveExpenses, totalLiveBalance,
    totalLiveInvestments, liveSavingsRate,
    isRefreshing, secondsAgo, pulseKey, manualRefresh,
  } = useRealTime();

  const recentExpenses = liveExpenses.slice(0, 6);
  const gridStroke = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  return (
    <div className="min-h-screen" style={{ background: "var(--iq-bg)" }}>
      {/* Top Bar */}
      <div
        className="sticky top-0 z-20 px-4 lg:px-8 py-4 flex items-center justify-between"
        style={{ background: "var(--iq-header)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--iq-border)" }}
      >
        <div>
          <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Good morning,</p>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)", lineHeight: 1.2 }}>
            Arjun Sharma 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">

          {/* Manual Refresh */}
          <motion.button
            onClick={manualRefresh}
            whileTap={{ scale: 0.9 }}
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={isRefreshing ? { duration: 0.6, ease: "linear" } : { duration: 0 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: isRefreshing ? "var(--iq-accent-s2)" : "var(--iq-surface)",
              border: isRefreshing ? "1px solid var(--iq-accent-b)" : "1px solid transparent",
            }}
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" style={{ color: isRefreshing ? "var(--iq-accent)" : "var(--iq-text-3)" }} />
          </motion.button>

          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--iq-surface)" }}>
            <Search className="w-4 h-4" style={{ color: "var(--iq-text-3)" }} />
          </button>
          <div className="relative">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--iq-surface)" }}>
              <Bell className="w-4 h-4" style={{ color: "var(--iq-text-3)" }} />
            </button>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: "#EF4444", borderColor: "var(--iq-notification-b)" }} />
          </div>

          {/* Add Expense — primary CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={openAddExpense}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "var(--iq-accent-grad)",
              boxShadow: "0 4px 16px var(--iq-accent-glow)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </motion.button>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--iq-accent-grad)", fontSize: "12px", fontWeight: 700, color: "#fff" }}
          >
            AS
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6 space-y-6">

        {/* ── 5 Stat Cards ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isRefreshing ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {[0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} height={130} />)}
            </motion.div>
          ) : (
            <motion.div
              key={`cards-${pulseKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {/* 1 · Income */}
              <StatCard
                title="Monthly Income"
                value={monthlyIncome}
                subtitle="Take-home salary"
                icon={Banknote}
                color="#10B981"
                isRefreshing={isRefreshing}
              />
              {/* 2 · Expense */}
              <StatCard
                title="Total Expenses"
                value={totalLiveExpenses}
                subtitle="February 2026"
                icon={TrendingDown}
                color="#EF4444"
                trend="+7.8%"
                trendUp={true}
                isRefreshing={isRefreshing}
              />
              {/* 3 · Savings */}
              <StatCard
                title="Savings"
                value={totalLiveBalance}
                subtitle="Remaining this month"
                icon={Wallet}
                color="var(--iq-accent)"
                isRefreshing={isRefreshing}
              />
              {/* 4 · Saving Rate */}
              <StatCard
                title="Saving Rate"
                value={liveSavingsRate}
                subtitle="of monthly income"
                icon={PiggyBank}
                color="#8B5CF6"
                prefix=""
                suffix="%"
                decimals={1}
                isRefreshing={isRefreshing}
              />
              {/* 5 · Expense Rate */}
              <StatCard
                title="Expense Rate"
                value={parseFloat(((totalLiveExpenses / monthlyIncome) * 100).toFixed(1))}
                subtitle="of income spent"
                icon={BarChart2}
                color="#F59E0B"
                prefix=""
                suffix="%"
                decimals={1}
                isRefreshing={isRefreshing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Charts Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Interactive Timeline Chart */}
          <div
            className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Spending Timeline</h3>
                <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Interactive · drag brush to zoom</p>
              </div>
            </div>
            <TimelineChart />
          </div>

          {/* Category Donut with glow active shape */}
          <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "2px" }}>By Category</h3>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "6px" }}>Hover a slice for details</p>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderCategoryActiveShape}
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(0)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={index === activeIndex ? 1 : 0.6} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const d = payload[0].payload;
                      return (
                        <div className="px-3 py-2 rounded-xl" style={{ background: "rgba(15,17,21,0.95)", border: `1px solid ${d.color}40`, boxShadow: `0 8px 32px ${d.color}30` }}>
                          <p style={{ fontSize: "12px", fontWeight: 700, color: d.color }}>{d.name}</p>
                          <p style={{ fontSize: "13px", color: "var(--iq-text-1)" }}>₹{d.value.toLocaleString("en-IN")}</p>
                          <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{d.percentage}% of total</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {categoryData.slice(0, 4).map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-2 cursor-pointer rounded-lg px-1 py-0.5 transition-all"
                  style={{ background: activeIndex === i ? cat.color + "15" : "transparent" }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(0)}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <span style={{ fontSize: "11px", color: "var(--iq-text-3)", flex: 1 }} className="truncate">{cat.name}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--iq-text-2)" }}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Transactions + Family ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Recent Transactions</h3>
              <button className="flex items-center gap-1 text-sm" style={{ color: "var(--iq-accent)" }}>
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {recentExpenses.map((expense, i) => (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: getCategoryColor(expense.category) + "20", border: `1px solid ${getCategoryColor(expense.category)}30`, fontSize: "18px" }}
                    >
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }} className="truncate">{expense.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="px-1.5 py-0.5 rounded-md"
                          style={{ fontSize: "10px", background: getCategoryColor(expense.category) + "20", color: getCategoryColor(expense.category), fontWeight: 600 }}
                        >
                          {expense.category}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{expense.paymentMode}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#EF4444" }}>-₹{expense.amount.toLocaleString("en-IN")}</p>
                      <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>
                        {new Date(expense.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Family Summary */}
          <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Family</h3>
              <Users className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
            </div>
            <div className="space-y-3">
              {familyMembers.map((member) => {
                const memberExpenses = liveExpenses.filter((e) => e.paidBy === member.id);
                const spent = memberExpenses.reduce((s, e) => s + e.amount, 0);
                const owes = liveExpenses.flatMap((e) => e.splitWith).filter((s) => s.memberId === member.id).reduce((s, i) => s + i.amount, 0);
                return (
                  <div key={member.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: member.color + "30", fontSize: "11px", fontWeight: 700, color: member.color }}
                      >
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--iq-text-2)" }}>{member.name.split(" ")[0]}</p>
                        <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>
                          Paid ₹{spent.toLocaleString("en-IN")}
                          {owes > 0 && ` · Owes ₹${owes.toLocaleString("en-IN")}`}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md" style={{ fontSize: "10px", background: member.color + "20", color: member.color, fontWeight: 600 }}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className="w-full mt-4 py-2 rounded-xl transition-all"
              style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)", color: "var(--iq-accent)", fontSize: "13px", fontWeight: 600 }}
            >
              Settle Up Now
            </button>
          </div>
        </div>

        {/* ── Expense Ratio ───────────────────────────────────────── */}
        <motion.div
          key={`ratio-${pulseKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Expense Ratio</h3>
              <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Spent vs Saved — updates instantly on new entry</p>
            </div>
            <AnimatePresence>
              {isRefreshing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="px-2 py-1 rounded-full"
                  style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)", fontSize: "10px", color: "var(--iq-accent)", fontWeight: 700 }}
                >
                  Recalculating…
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="space-y-3">
            {[
              { label: "Expenses",    value: totalLiveExpenses,    color: "#EF4444" },
              { label: "Investments", value: totalLiveInvestments, color: "#10B981" },
              { label: "Savings",     value: totalLiveBalance,     color: "var(--iq-accent)" },
            ].map((item) => {
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "12px", color: "var(--iq-text-3)" }}>{item.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: item.color }}>
                      <CountUp end={item.value} prefix="₹" /> ({((item.value / monthlyIncome) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--iq-progress)" }}>
                    <motion.div
                      key={`${item.label}-${pulseKey}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / monthlyIncome) * 100}%` }}
                      transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}