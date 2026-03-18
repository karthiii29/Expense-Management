import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";

// Supplementary mock data removed — all data now comes from DataContext

function getSpendColor(amount: number, isDark: boolean): string {
  if (amount === 0) return isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  if (amount < 1000) return isDark ? "#1a2d1a" : "#d1fae5";
  if (amount < 3000) return "#065f46";
  if (amount < 6000) return "#d97706";
  if (amount < 12000) return "#ef4444";
  return "#8b5cf6";
}

function getTextColor(amount: number): string {
  if (amount === 0) return "var(--iq-text-4)";
  if (amount < 1000) return "#6ee7b7";
  if (amount < 3000) return "#34d399";
  if (amount < 6000) return "#fcd34d";
  if (amount < 12000) return "#fca5a5";
  return "#c4b5fd";
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function HeatmapCalendar() {
  const { expenses } = useData();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Determine which month/year to show — use the month with most expenses, or current month
  const now = new Date();
  const monthCounts: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.date.slice(0, 7); // "YYYY-MM"
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const topMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [year, month] = topMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDOW = new Date(year, month - 1, 1).getDay(); // 0=Sun

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Build daily totals for this month
  const dailyTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    if (e.date.startsWith(topMonth)) {
      dailyTotals[e.date] = (dailyTotals[e.date] ?? 0) + e.amount;
    }
  });

  // Build calendar weeks
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDOW).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7 || d === daysInMonth) {
      while (week.length < 7) week.push(null);
      weeks.push([...week]);
      week = [];
    }
  }

  const maxSpend = Math.max(...Object.values(dailyTotals).filter(Boolean), 1);
  const totalMonth = Object.values(dailyTotals).reduce((s: number, v: number) => s + v, 0);
  const activeDays = Object.values(dailyTotals).filter((v: number) => v > 0).length;

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{monthLabel}</p>
          <p style={{ fontSize: "11px", color: "var(--iq-text-4)", marginTop: "2px" }}>
            {activeDays} active days · ₹{totalMonth.toLocaleString("en-IN")} total
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1">
          <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Low</span>
          {["rgba(255,255,255,0.04)", "#065f46", "#d97706", "#ef4444", "#8b5cf6"].map((c, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-sm"
              style={{ background: c, border: "1px solid rgba(255,255,255,0.08)" }}
            />
          ))}
          <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>High</span>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center" style={{ fontSize: "10px", color: "var(--iq-text-4)", fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {week.map((day, di) => {
              if (day === null) return <div key={di} />;
              const dateStr = `${year}-${String(month).padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              const amount = dailyTotals[dateStr] ?? 0;
              const bgColor = getSpendColor(amount, isDark);
              const isHovered = hoveredDay === dateStr;

              return (
                <motion.div
                  key={di}
                  className="relative flex flex-col items-center justify-center rounded-lg cursor-pointer"
                  style={{
                    background: bgColor,
                    border: isHovered
                      ? "1px solid var(--iq-accent)"
                      : "1px solid rgba(255,255,255,0.06)",
                    aspectRatio: "1",
                    minWidth: 0,
                  }}
                  whileHover={{ scale: 1.12, zIndex: 10 }}
                  onMouseEnter={(e) => {
                    setHoveredDay(dateStr);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wi * 7 + di) * 0.012, duration: 0.2 }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: amount > 0 ? 700 : 500,
                      color: amount > 0 ? getTextColor(amount) : "var(--iq-text-4)",
                      lineHeight: 1,
                    }}
                  >
                    {day}
                  </span>
                  {amount > 3000 && (
                    <div
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: getTextColor(amount), opacity: 0.8 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hover tooltip — fixed position */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            style={{
              position: "fixed",
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 60,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <div
              className="px-3 py-2 rounded-xl"
              style={{
                background: "rgba(15,17,21,0.95)",
                border: "1px solid var(--iq-border-s)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                backdropFilter: "blur(16px)",
                minWidth: "120px",
              }}
            >
              <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginBottom: "4px" }}>
                {new Date(hoveredDay + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <p style={{ fontSize: "14px", fontWeight: 700, color: dailyTotals[hoveredDay] > 0 ? getTextColor(dailyTotals[hoveredDay]) : "var(--iq-text-4)" }}>
                {dailyTotals[hoveredDay] > 0
                  ? `₹${dailyTotals[hoveredDay].toLocaleString("en-IN")}`
                  : "No spend 🎉"}
              </p>
              {dailyTotals[hoveredDay] > 0 && (
                <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginTop: "2px" }}>
                  {((dailyTotals[hoveredDay] / maxSpend) * 100).toFixed(0)}% of peak
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom intensity scale */}
      <div className="mt-4 flex items-center gap-2">
        <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Spend intensity:</span>
        <div
          className="flex-1 h-2 rounded-full overflow-hidden"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, #065f46 20%, #d97706 50%, #ef4444 75%, #8b5cf6 100%)",
          }}
        />
        <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>₹{(maxSpend / 1000).toFixed(0)}k max</span>
      </div>
    </div>
  );
}