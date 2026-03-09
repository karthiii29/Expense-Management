import { useState } from "react";
import { Search, Filter, Trash2, Edit3, ChevronDown, SlidersHorizontal, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  expenses as initialExpenses,
  familyMembers, CATEGORIES, PAYMENT_MODES,
  getCategoryColor, getCategoryIcon, Category, PaymentMode,
} from "../data/mockData";
import { AddExpenseModal } from "../components/AddExpenseModal";

const paymentModeIcon: Record<string, string> = {
  UPI: "📱",
  Card: "💳",
  Cash: "💵",
  "Bank Transfer": "🏦",
};

export function Expenses() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editExpense, setEditExpense] = useState<any | null>(null);
  const [expenses, setExpenses] = useState(initialExpenses);

  const filtered = expenses.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || e.category === categoryFilter;
    const matchPay = paymentFilter === "All" || e.paymentMode === paymentFilter;
    return matchSearch && matchCat && matchPay;
  });

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)" }}>Expenses</h1>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>
              {filtered.length} transactions · ₹{totalFiltered.toLocaleString("en-IN")} total
            </p>
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            style={{
              background: filterOpen ? "var(--iq-accent-s2)" : "var(--iq-surface)",
              border: filterOpen ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border-s)",
              color: filterOpen ? "var(--iq-accent)" : "var(--iq-text-3)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
            style={{
              background: "var(--iq-surface)",
              border: "1px solid var(--iq-border-s)",
              color: "var(--iq-text-1)",
              fontSize: "14px",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
            </button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", ...CATEGORIES].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className="px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          background: categoryFilter === cat ? "var(--iq-accent-s2)" : "var(--iq-surface)",
                          border: categoryFilter === cat ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border)",
                          color: categoryFilter === cat ? "var(--iq-accent)" : "var(--iq-text-3)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>Payment Mode</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", ...PAYMENT_MODES].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPaymentFilter(mode)}
                        className="px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          background: paymentFilter === mode ? "var(--iq-accent-s2)" : "var(--iq-surface)",
                          border: paymentFilter === mode ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border)",
                          color: paymentFilter === mode ? "var(--iq-accent)" : "var(--iq-text-3)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 lg:px-8 py-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: `₹${totalFiltered.toLocaleString("en-IN")}`, color: "#EF4444" },
            { label: "Transactions", value: filtered.length.toString(), color: "var(--iq-accent)" },
            { label: "Avg/Transaction", value: `₹${filtered.length ? Math.round(totalFiltered / filtered.length).toLocaleString("en-IN") : 0}`, color: "#8B5CF6" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
            >
              <p style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Expense List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border-s)" }}
            >
              <span style={{ fontSize: "32px" }}>🔍</span>
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--iq-text-3)" }}>No expenses found</p>
            <p style={{ fontSize: "13px", color: "var(--iq-text-4)" }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((expense, i) => {
              const paidByMember = familyMembers.find((m) => m.id === expense.paidBy);
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group rounded-2xl p-4 transition-all"
                  style={{
                    background: "var(--iq-surface)",
                    border: "1px solid var(--iq-border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: getCategoryColor(expense.category) + "20",
                        border: `1px solid ${getCategoryColor(expense.category)}30`,
                        fontSize: "20px",
                      }}
                    >
                      {getCategoryIcon(expense.category)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--iq-text-1)" }} className="truncate">
                          {expense.title}
                        </p>
                        {expense.recurring && (
                          <span
                            className="px-1.5 py-0.5 rounded-md flex-shrink-0"
                            style={{ fontSize: "9px", background: "rgba(139,92,246,0.2)", color: "#8B5CF6", fontWeight: 700 }}
                          >
                            RECURRING
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-md"
                          style={{
                            fontSize: "10px",
                            background: getCategoryColor(expense.category) + "20",
                            color: getCategoryColor(expense.category),
                            fontWeight: 600,
                          }}
                        >
                          {expense.category}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>
                          {paymentModeIcon[expense.paymentMode]} {expense.paymentMode}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>
                          by {paidByMember?.name.split(" ")[0]}
                        </span>
                        {expense.splitWith.length > 0 && (
                          <span style={{ fontSize: "11px", color: "#8B5CF6" }}>
                            Split with {expense.splitWith.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444" }}>
                        -₹{expense.amount.toLocaleString("en-IN")}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>
                        {new Date(expense.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditExpense(expense)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                      >
                        <Edit3 className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
                      </button>
                      <button
                        onClick={() => setDeleteId(expense.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {expense.notes && (
                    <div
                      className="mt-2 px-3 py-2 rounded-lg"
                      style={{ background: "var(--iq-surface-h)" }}
                    >
                      <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>📝 {expense.notes}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-96 z-50 rounded-2xl p-6"
              style={{
                background: "var(--iq-modal)",
                border: "1px solid rgba(239,68,68,0.2)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  <AlertCircle className="w-7 h-7" style={{ color: "#EF4444" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--iq-text-1)" }}>Delete Expense?</h3>
                  <p style={{ fontSize: "14px", color: "var(--iq-text-3)", marginTop: "8px" }}>
                    This action cannot be undone. The expense will be permanently removed.
                  </p>
                </div>
                <div className="flex gap-3 w-full pt-2">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-3 rounded-xl"
                    style={{
                      background: "var(--iq-surface)",
                      border: "1px solid var(--iq-border-s)",
                      color: "var(--iq-text-3)",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-3 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #EF4444, #DC2626)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      boxShadow: "0 4px 20px rgba(239,68,68,0.3)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editExpense && (
        <AddExpenseModal
          open={!!editExpense}
          onClose={() => setEditExpense(null)}
          editData={editExpense}
        />
      )}
    </div>
  );
}
