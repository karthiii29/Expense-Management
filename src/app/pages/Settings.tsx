import { useState } from "react";
import {
  User, Palette, DollarSign, Users, Shield, Bell,
  Database, Lock, ChevronRight, Moon, Sun, Smartphone,
  Globe, Key, Fingerprint, LogOut, Trash2, Info,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme, ThemeMode, AccentColor } from "../context/ThemeContext";

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

const accentOptions: { color: AccentColor; hex: string; label: string }[] = [
  { color: "blue", hex: "#00D4FF", label: "Blue" },
  { color: "purple", hex: "#8B5CF6", label: "Purple" },
  { color: "green", hex: "#10B981", label: "Green" },
  { color: "amber", hex: "#F59E0B", label: "Amber" },
  { color: "pink", hex: "#EC4899", label: "Pink" },
];

type SettingSection = "profile" | "appearance" | "currency" | "members" | "security" | "notifications" | "backup";

export function Settings() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingSection>("profile");
  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState({
    expenseAdded: true,
    settlementDue: true,
    monthlyReport: true,
    budgetAlert: false,
    recurringExpense: true,
  });
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@family.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [biometric, setBiometric] = useState(false);
  const [pin, setPin] = useState(true);

  const sections: { id: SettingSection; icon: any; label: string; desc: string }[] = [
    { id: "profile", icon: User, label: "Profile", desc: "Name, email, photo" },
    { id: "appearance", icon: Palette, label: "Appearance", desc: "Theme & display" },
    { id: "currency", icon: DollarSign, label: "Currency", desc: "Regional settings" },
    { id: "notifications", icon: Bell, label: "Notifications", desc: "Alerts & reminders" },
    { id: "security", icon: Shield, label: "Security", desc: "PIN & biometric" },
    { id: "backup", icon: Database, label: "Data & Backup", desc: "Export & sync" },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? "var(--iq-accent)" : "var(--iq-border-s)" }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: value ? "calc(100% - 20px)" : "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
      />
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "var(--iq-accent-grad)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  AJ
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "var(--iq-modal)", border: "1px solid var(--iq-border)" }}
                >
                  <Palette className="w-3.5 h-3.5" style={{ color: "var(--iq-text-3)" }} />
                </button>
              </div>
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--iq-text-1)" }}>Alex Johnson</p>
                <p style={{ fontSize: "13px", color: "var(--iq-text-4)" }}>alex@family.com</p>
                <span
                  className="px-2 py-0.5 rounded-full inline-block mt-1"
                  style={{ fontSize: "11px", background: "rgba(245,158,11,0.2)", color: "#F59E0B", fontWeight: 600 }}
                >
                  Admin
                </span>
              </div>
            </div>

            {/* Form */}
            {[
              { label: "Full Name", value: name, setter: setName, type: "text" },
              { label: "Email Address", value: email, setter: setEmail, type: "email" },
              { label: "Phone Number", value: phone, setter: setPhone, type: "tel" },
            ].map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-3)" }}>{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    background: "var(--iq-surface-h)",
                    border: "1px solid var(--iq-border)",
                    color: "var(--iq-text-1)",
                    fontSize: "14px",
                  }}
                />
              </div>
            ))}

            <button
              className="w-full py-3 rounded-xl"
              style={{
                background: "var(--iq-accent-grad)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                boxShadow: "0 4px 20px var(--iq-accent-glow)",
              }}
            >
              Save Profile
            </button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-5">
            {/* Color Theme */}
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "12px" }}>
                Color Theme
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "dark" as ThemeMode, label: "Dark", icon: Moon, preview: "#0F1115" },
                  { value: "light" as ThemeMode, label: "Light", icon: Sun, preview: "#F0F4F8" },
                  { value: "auto" as ThemeMode, label: "Auto", icon: Smartphone, preview: "linear-gradient(135deg, #0F1115, #F9FAFB)" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                    style={{
                      background: theme === opt.value ? "var(--iq-accent-s2)" : "var(--iq-surface-h)",
                      border: theme === opt.value ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: opt.preview.startsWith("linear") ? undefined : opt.preview,
                        backgroundImage: opt.preview.startsWith("linear") ? opt.preview : undefined,
                        border: "1px solid var(--iq-border-s)",
                      }}
                    >
                      <opt.icon className="w-5 h-5" style={{ color: theme === opt.value ? "var(--iq-accent)" : "var(--iq-text-4)" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: theme === opt.value ? "var(--iq-accent)" : "var(--iq-text-3)" }}>
                      {opt.label}
                    </span>
                    {theme === opt.value && (
                      <Check className="w-4 h-4" style={{ color: "var(--iq-accent)" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--iq-surface-h)", border: "1px solid var(--iq-border)" }}
            >
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--iq-text-1)", marginBottom: "4px" }}>
                Accent Color
              </h4>
              <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "14px" }}>
                Choose your preferred accent color for the entire app
              </p>
              <div className="flex gap-3 flex-wrap">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.color}
                    onClick={() => setAccentColor(opt.color)}
                    className="flex flex-col items-center gap-1.5 transition-all"
                    title={opt.label}
                  >
                    <div
                      className="w-10 h-10 rounded-full border-4 transition-all"
                      style={{
                        background: opt.hex,
                        borderColor: accentColor === opt.color ? "var(--iq-text-1)" : "transparent",
                        boxShadow: accentColor === opt.color ? `0 0 0 2px ${opt.hex}` : "none",
                        transform: accentColor === opt.color ? "scale(1.15)" : "scale(1)",
                      }}
                    />
                    <span style={{
                      fontSize: "10px",
                      fontWeight: accentColor === opt.color ? 700 : 400,
                      color: accentColor === opt.color ? "var(--iq-accent)" : "var(--iq-text-4)",
                    }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)" }}
            >
              <p style={{ fontSize: "13px", color: "var(--iq-accent)", fontWeight: 600, marginBottom: "8px" }}>
                Live Preview
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-xl text-white"
                  style={{ background: "var(--iq-accent-grad)", fontSize: "13px", fontWeight: 600 }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-xl"
                  style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)", color: "var(--iq-text-2)", fontSize: "13px" }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        );

      case "currency":
        return (
          <div className="space-y-3">
            <p style={{ fontSize: "13px", color: "var(--iq-text-3)", marginBottom: "16px" }}>
              Select your preferred currency for displaying amounts
            </p>
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all"
                style={{
                  background: currency === curr.code ? "var(--iq-accent-s)" : "var(--iq-surface-h)",
                  border: currency === curr.code ? "1px solid var(--iq-accent-b2)" : "1px solid var(--iq-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: currency === curr.code ? "var(--iq-accent-s2)" : "var(--iq-surface)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: currency === curr.code ? "var(--iq-accent)" : "var(--iq-text-3)",
                  }}
                >
                  {curr.symbol}
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: "14px", fontWeight: 600, color: currency === curr.code ? "var(--iq-text-1)" : "var(--iq-text-2)" }}>
                    {curr.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{curr.code}</p>
                </div>
                {currency === curr.code && (
                  <Check className="w-5 h-5" style={{ color: "var(--iq-accent)" }} />
                )}
              </button>
            ))}
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => {
              const labels: Record<string, { title: string; desc: string }> = {
                expenseAdded: { title: "Expense Added", desc: "When a family member adds an expense" },
                settlementDue: { title: "Settlement Due", desc: "When pending settlements are overdue" },
                monthlyReport: { title: "Monthly Report", desc: "Get your monthly expense summary" },
                budgetAlert: { title: "Budget Alert", desc: "When spending exceeds your limit" },
                recurringExpense: { title: "Recurring Expense", desc: "Before recurring expenses are due" },
              };
              const l = labels[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: "var(--iq-surface-h)", border: "1px solid var(--iq-border)" }}
                >
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }}>{l.title}</p>
                    <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{l.desc}</p>
                  </div>
                  <Toggle
                    value={value}
                    onChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
                  />
                </div>
              );
            })}
          </div>
        );

      case "security":
        return (
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "var(--iq-surface-h)", border: "1px solid var(--iq-border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--iq-accent-s)" }}>
                  <Key className="w-5 h-5" style={{ color: "var(--iq-accent)" }} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }}>App PIN</p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Protect app with a 6-digit PIN</p>
                </div>
              </div>
              <Toggle value={pin} onChange={setPin} />
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "var(--iq-surface-h)", border: "1px solid var(--iq-border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <Fingerprint className="w-5 h-5" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }}>Biometric Lock</p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Use fingerprint or Face ID</p>
                </div>
              </div>
              <Toggle value={biometric} onChange={setBiometric} />
            </div>

            {[
              { icon: Key, color: "#F59E0B", label: "Change PIN", desc: "Update your security PIN" },
              { icon: Shield, color: "#8B5CF6", label: "Two-Factor Auth", desc: "Extra layer of security" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all"
                style={{ background: "var(--iq-surface-h)", border: "1px solid var(--iq-border)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: item.color + "20" }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }}>{item.label}</p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
              </button>
            ))}

            <div className="pt-2">
              <button
                className="w-full flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <LogOut className="w-5 h-5" style={{ color: "#EF4444" }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>Sign Out</span>
              </button>
            </div>
          </div>
        );

      case "backup":
        return (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4" style={{ color: "var(--iq-accent)" }} />
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-accent)" }}>Last Backup</p>
              </div>
              <p style={{ fontSize: "13px", color: "var(--iq-text-3)" }}>Today at 3:42 AM · All data synced</p>
            </div>

            {[
              { icon: Database, color: "#10B981", label: "Backup Now", desc: "Save data to cloud" },
              { icon: Globe, color: "var(--iq-accent)", label: "Sync Settings", desc: "Manage cloud sync" },
              { icon: Database, color: "#8B5CF6", label: "Export All Data", desc: "Download complete backup" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all"
                style={{ background: "var(--iq-surface-h)", border: "1px solid var(--iq-border)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: item.color + "20" }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--iq-text-2)" }}>{item.label}</p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
              </button>
            ))}

            <div className="pt-2">
              <button
                className="w-full flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                <Trash2 className="w-5 h-5" style={{ color: "#EF4444" }} />
                <div className="text-left">
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>Delete All Data</p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>This action is irreversible</p>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
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
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)" }}>Settings</h1>
        <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Manage your preferences</p>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Nav */}
          <div className="lg:w-60 flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden lg:sticky lg:top-24"
              style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                  style={{
                    background: activeSection === section.id ? "var(--iq-accent-s)" : "transparent",
                    borderLeft: activeSection === section.id ? "2px solid var(--iq-accent)" : "2px solid transparent",
                  }}
                >
                  <section.icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: activeSection === section.id ? "var(--iq-accent)" : "var(--iq-text-4)" }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: activeSection === section.id ? 600 : 500,
                        color: activeSection === section.id ? "var(--iq-text-1)" : "var(--iq-text-3)",
                        lineHeight: 1.2,
                      }}
                    >
                      {section.label}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{section.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-5"
              style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--iq-text-1)",
                  marginBottom: "20px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--iq-border)",
                }}
              >
                {sections.find((s) => s.id === activeSection)?.label}
              </h3>
              {renderContent()}
            </motion.div>

            {/* App Info */}
            <div className="mt-4 text-center">
              <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>ExpenseIQ v2.1.0 · Built with ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
