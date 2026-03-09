import { useState } from "react";
import {
  Download, FileSpreadsheet, FileText, FileJson,
  Share2, Calendar, ChevronDown, Filter,
} from "lucide-react";
import { motion } from "motion/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { expenses, categoryData, familyMembers, monthlyData, getCategoryColor, getCategoryIcon } from "../data/mockData";
import { useTheme } from "../context/ThemeContext";

const exportOptions = [
  {
    icon: FileSpreadsheet,
    label: "Export Excel",
    desc: "Full data spreadsheet (.xlsx)",
    color: "#10B981",
    ext: "xlsx",
  },
  {
    icon: FileText,
    label: "Export PDF",
    desc: "Formatted report (.pdf)",
    color: "#EF4444",
    ext: "pdf",
  },
  {
    icon: FileJson,
    label: "Export CSV",
    desc: "Raw data file (.csv)",
    color: "#F59E0B",
    ext: "csv",
  },
  {
    icon: Share2,
    label: "Share Summary",
    desc: "Copy shareable note",
    color: "#8B5CF6",
    ext: "txt",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2.5 rounded-xl"
        style={{
          background: "var(--iq-tooltip)",
          border: "1px solid var(--iq-border-s)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
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
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color || "var(--iq-accent)" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--iq-text-1)" }}>
              ₹{Number(entry.value).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Reports() {
  const [dateFrom, setDateFrom] = useState("2026-02-01");
  const [dateTo, setDateTo] = useState("2026-02-28");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [memberFilter, setMemberFilter] = useState("All");
  const [exportingId, setExportingId] = useState<string | null>(null);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  const filtered = expenses.filter((e) => {
    const inRange = e.date >= dateFrom && e.date <= dateTo;
    const matchCat = categoryFilter === "All" || e.category === categoryFilter;
    const matchMem = memberFilter === "All" || e.paidBy === memberFilter;
    return inRange && matchCat && matchMem;
  });

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);
  const gridStroke = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  const handleExport = (ext: string, label: string) => {
    setExportingId(ext);
    setTimeout(() => {
      setExportingId(null);
      const content = ext === "csv"
        ? "Title,Amount,Category,Date,Payment Mode\n" +
          filtered.map((e) => `${e.title},${e.amount},${e.category},${e.date},${e.paymentMode}`).join("\n")
        : `Expense Report\nTotal: ₹${totalAmount.toLocaleString("en-IN")}\nTransactions: ${filtered.length}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expense-report.${ext}`;
      a.click();
    }, 1200);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--iq-bg)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 lg:px-8 py-4"
        style={{
          background: "var(--iq-header)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--iq-border)",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)" }}>Reports</h1>
        <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Export and analyze your expense data</p>
      </div>

      <div className="px-4 lg:px-8 py-6 space-y-6">
        {/* Filters */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4" style={{ color: "var(--iq-accent)" }} />
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--iq-text-1)" }}>Filter Report</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Date From */}
            <div className="space-y-1.5">
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl outline-none"
                  style={{
                    background: "var(--iq-surface-h)",
                    border: "1px solid var(--iq-border-s)",
                    color: "var(--iq-text-1)",
                    fontSize: "13px",
                    colorScheme: isDark ? "dark" : "light",
                  }}
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl outline-none"
                  style={{
                    background: "var(--iq-surface-h)",
                    border: "1px solid var(--iq-border-s)",
                    color: "var(--iq-text-1)",
                    fontSize: "13px",
                    colorScheme: isDark ? "dark" : "light",
                  }}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 rounded-xl outline-none appearance-none"
                  style={{
                    background: "var(--iq-surface-h)",
                    border: "1px solid var(--iq-border-s)",
                    color: "var(--iq-text-1)",
                    fontSize: "13px",
                  }}
                >
                  <option value="All">All Categories</option>
                  {["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Education", "Travel"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--iq-text-4)" }} />
              </div>
            </div>

            {/* Member */}
            <div className="space-y-1.5">
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>Member</label>
              <div className="relative">
                <select
                  value={memberFilter}
                  onChange={(e) => setMemberFilter(e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 rounded-xl outline-none appearance-none"
                  style={{
                    background: "var(--iq-surface-h)",
                    border: "1px solid var(--iq-border-s)",
                    color: "var(--iq-text-1)",
                    fontSize: "13px",
                  }}
                >
                  <option value="All">All Members</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--iq-text-4)" }} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div
            className="flex items-center justify-between mt-4 p-3 rounded-xl"
            style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)" }}
          >
            <div className="flex gap-6">
              <div>
                <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Transactions</p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--iq-text-1)" }}>{filtered.length}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Total Amount</p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444" }}>₹{totalAmount.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Date Range</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                  {new Date(dateFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(dateTo).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "12px" }}>
            Export Options
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {exportOptions.map((opt) => (
              <motion.button
                key={opt.ext}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleExport(opt.ext, opt.label)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all"
                style={{
                  background: exportingId === opt.ext ? opt.color + "20" : "var(--iq-surface)",
                  border: exportingId === opt.ext ? `1px solid ${opt.color}40` : "1px solid var(--iq-border)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: opt.color + "20" }}
                >
                  {exportingId === opt.ext ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Download className="w-6 h-6" style={{ color: opt.color }} />
                    </motion.div>
                  ) : (
                    <opt.icon className="w-6 h-6" style={{ color: opt.color }} />
                  )}
                </div>
                <div className="text-center">
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>{opt.label}</p>
                  <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{opt.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "4px" }}>
            Category Breakdown
          </h3>
          <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "16px" }}>Spending by category for selected period</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical" barSize={16} margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <defs>
                {categoryData.map((entry) => (
                  <linearGradient key={`grad-${entry.name}`} id={`grad-${entry.name.replace(/[^a-zA-Z]/g, "")}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "var(--iq-text-4)" as string, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "var(--iq-text-3)" as string, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {categoryData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={`url(#grad-${entry.name.replace(/[^a-zA-Z]/g, "")})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--iq-border)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>
              Transaction Details ({filtered.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--iq-border)" }}>
                  {["Date", "Title", "Category", "Payment", "Amount"].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left"
                      style={{ fontSize: "11px", fontWeight: 600, color: "var(--iq-text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((expense, i) => (
                  <tr
                    key={expense.id}
                    style={{ borderBottom: "1px solid var(--iq-border)" }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "var(--iq-text-3)" }}>
                      {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-5 py-3" style={{ fontSize: "13px", fontWeight: 500, color: "var(--iq-text-2)" }}>
                      {expense.title}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-0.5 rounded-md"
                        style={{
                          fontSize: "11px",
                          background: getCategoryColor(expense.category) + "20",
                          color: getCategoryColor(expense.category),
                          fontWeight: 600,
                        }}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "var(--iq-text-3)" }}>
                      {expense.paymentMode}
                    </td>
                    <td className="px-5 py-3" style={{ fontSize: "14px", fontWeight: 700, color: "#EF4444" }}>
                      -₹{expense.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "1px solid var(--iq-border-s)" }}>
                  <td colSpan={4} className="px-5 py-3" style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-3)" }}>
                    Total
                  </td>
                  <td className="px-5 py-3" style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444" }}>
                    -₹{totalAmount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}