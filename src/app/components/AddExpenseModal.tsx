import { useState } from "react";
import { X, Upload, RefreshCw, ChevronDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, PAYMENT_MODES, familyMembers, Category, PaymentMode } from "../data/mockData";
import { useTheme } from "../context/ThemeContext";
import { useRealTime } from "../context/RealTimeContext";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  editData?: any;
}

export function AddExpenseModal({ open, onClose, editData }: AddExpenseModalProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(editData?.title || "");
  const [amount, setAmount] = useState(editData?.amount?.toString() || "");
  const [category, setCategory] = useState<Category>(editData?.category || "Food & Dining");
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split("T")[0]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(editData?.paymentMode || "UPI");
  const [notes, setNotes] = useState(editData?.notes || "");
  const [recurring, setRecurring] = useState(editData?.recurring || false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [saved, setSaved] = useState(false);
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  const { addLiveExpense } = useRealTime();

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const getEqualSplit = () => {
    const total = parseFloat(amount) || 0;
    const count = selectedMembers.length + 1;
    return (total / count).toFixed(2);
  };

  const handleSave = () => {
    const parsed = parseFloat(amount);
    if (!title.trim() || !parsed) return;

    const newExpense = {
      id: `live-${Date.now()}`,
      title: title.trim(),
      amount: parsed,
      category,
      date,
      paymentMode,
      notes,
      recurring,
      paidBy: "1",
      splitWith: selectedMembers.map((mId) => ({
        memberId: mId,
        amount: parseFloat(getEqualSplit()),
      })),
    };

    addLiveExpense(newExpense);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      setStep(1);
      setTitle("");
      setAmount("");
      setNotes("");
      setSelectedMembers([]);
    }, 900);
  };

  const categories = CATEGORIES;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[560px] md:max-h-[90vh] z-50 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "var(--iq-modal)",
              border: "1px solid var(--iq-border-s)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 0 0 1px var(--iq-accent-s)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
              style={{ borderColor: "var(--iq-border)" }}
            >
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--iq-text-1)" }}>
                  {editData ? "Edit Expense" : "Add New Expense"}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--iq-text-4)" }}>
                  Step {step} of 2
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "var(--iq-surface)" }}
              >
                <X className="w-4 h-4" style={{ color: "var(--iq-text-3)" }} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 pt-4 flex-shrink-0">
              <div className="flex gap-2">
                <div
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{ background: step >= 1 ? "var(--iq-accent-grad)" : "var(--iq-border-s)" }}
                />
                <div
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{ background: step >= 2 ? "var(--iq-accent-grad)" : "var(--iq-border-s)" }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div className="space-y-2">
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                      Expense Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Grocery Shopping"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                      style={{
                        background: "var(--iq-surface)",
                        border: "1px solid var(--iq-border-s)",
                        color: "var(--iq-text-1)",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                      Amount (₹) *
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--iq-text-4)", fontSize: "16px", fontWeight: 600 }}
                      >
                        ₹
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 rounded-xl outline-none"
                        style={{
                          background: "var(--iq-surface)",
                          border: "1px solid var(--iq-border-s)",
                          color: "var(--iq-text-1)",
                          fontSize: "18px",
                          fontWeight: 700,
                        }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                      Category *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {categories.slice(0, 8).map((cat) => {
                        const icons: Record<string, string> = {
                          "Food & Dining": "🍽️", "Transport": "🚗", "Shopping": "🛍️",
                          "Entertainment": "🎬", "Health": "💊", "Utilities": "⚡",
                          "Education": "📚", "Travel": "✈️", "Investment": "📈", "Other": "📌",
                        };
                        return (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                            style={{
                              background: category === cat ? "var(--iq-accent-s2)" : "var(--iq-surface)",
                              border: category === cat ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border)",
                            }}
                          >
                            <span style={{ fontSize: "20px" }}>{icons[cat]}</span>
                            <span style={{ fontSize: "9px", color: category === cat ? "var(--iq-accent)" : "var(--iq-text-3)", textAlign: "center" }}>
                              {cat.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date & Payment Mode */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{
                          background: "var(--iq-surface)",
                          border: "1px solid var(--iq-border-s)",
                          color: "var(--iq-text-1)",
                          fontSize: "13px",
                          colorScheme: isDark ? "dark" : "light",
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                        Payment Mode
                      </label>
                      <div className="relative">
                        <select
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                          className="w-full px-4 py-3 rounded-xl outline-none appearance-none"
                          style={{
                            background: "var(--iq-surface)",
                            border: "1px solid var(--iq-border-s)",
                            color: "var(--iq-text-1)",
                            fontSize: "13px",
                          }}
                        >
                          {PAYMENT_MODES.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: "var(--iq-text-4)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{
                        background: "var(--iq-surface)",
                        border: "1px solid var(--iq-border-s)",
                        color: "var(--iq-text-1)",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {/* Upload Receipt */}
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors"
                    style={{ background: "var(--iq-surface)", border: "1px dashed var(--iq-border-s)" }}
                  >
                    <Upload className="w-5 h-5" style={{ color: "var(--iq-text-4)" }} />
                    <div>
                      <p style={{ fontSize: "13px", color: "var(--iq-text-2)", fontWeight: 500 }}>Upload Receipt</p>
                      <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>PNG, JPG, PDF up to 5MB</p>
                    </div>
                  </div>

                  {/* Recurring Toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5" style={{ color: recurring ? "var(--iq-accent)" : "var(--iq-text-4)" }} />
                      <div>
                        <p style={{ fontSize: "13px", color: "var(--iq-text-2)", fontWeight: 500 }}>Recurring Expense</p>
                        <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Repeats automatically</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setRecurring(!recurring)}
                      className="w-11 h-6 rounded-full transition-all relative"
                      style={{ background: recurring ? "var(--iq-accent)" : "var(--iq-border-s)" }}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: recurring ? "calc(100% - 20px)" : "4px" }}
                      />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "4px" }}>
                      Split with Family
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--iq-text-4)" }}>
                      Select members to split ₹{parseFloat(amount || "0").toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Split Type */}
                  <div className="flex gap-2">
                    {(["equal", "custom"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSplitType(type)}
                        className="flex-1 py-2 rounded-xl transition-all"
                        style={{
                          background: splitType === type ? "var(--iq-accent-s2)" : "var(--iq-surface)",
                          border: splitType === type ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border)",
                          color: splitType === type ? "var(--iq-accent)" : "var(--iq-text-3)",
                          fontSize: "13px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {type} Split
                      </button>
                    ))}
                  </div>

                  {/* Members */}
                  <div className="space-y-2">
                    {familyMembers.map((member) => {
                      const isSelected = selectedMembers.includes(member.id);
                      const myShare = isSelected ? getEqualSplit() : null;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: isSelected ? "var(--iq-accent-s)" : "var(--iq-surface)",
                            border: isSelected ? "1px solid var(--iq-accent-b)" : "1px solid var(--iq-border)",
                          }}
                          onClick={() => toggleMember(member.id)}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: member.color + "30", border: `2px solid ${member.color}40` }}
                          >
                            <span style={{ fontSize: "12px", fontWeight: 700, color: member.color }}>
                              {member.avatar}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }}>{member.name}</p>
                            <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{member.role}</p>
                          </div>
                          {isSelected && amount && (
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-accent)" }}>
                              ₹{myShare}
                            </span>
                          )}
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: isSelected ? "var(--iq-accent)" : "var(--iq-border-s)",
                              background: isSelected ? "var(--iq-accent)" : "transparent",
                            }}
                          >
                            {isSelected && <span className="text-white" style={{ fontSize: "11px" }}>✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedMembers.length > 0 && amount && (
                    <div
                      className="p-4 rounded-xl"
                      style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)" }}
                    >
                      <p style={{ fontSize: "13px", color: "var(--iq-accent)", fontWeight: 600 }}>
                        Split Summary
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--iq-text-3)", marginTop: "4px" }}>
                        You pay: ₹{getEqualSplit()} · {selectedMembers.length} others pay: ₹{getEqualSplit()} each
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 border-t flex gap-3 flex-shrink-0"
              style={{ borderColor: "var(--iq-border)" }}
            >
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{
                    background: "var(--iq-surface)",
                    border: "1px solid var(--iq-border-s)",
                    color: "var(--iq-text-3)",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 1) setStep(2);
                  else handleSave();
                }}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  background: "var(--iq-accent-grad)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "0 4px 20px var(--iq-accent-glow)",
                }}
              >
                {step === 1 ? "Next: Split" : editData ? "Save Changes" : "Add Expense"}
              </button>
              {saved && (
                <CheckCircle
                  className="absolute right-6 top-6 w-6 h-6 text-green-500"
                  style={{ animation: "fadeIn 0.5s ease-in-out" }}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}