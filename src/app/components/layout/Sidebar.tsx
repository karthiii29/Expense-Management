import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  Wallet,
  LogOut,
  Brain,
} from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/expenses", icon: Receipt, label: "Expenses" },
  { path: "/family", icon: Users, label: "Family" },
  { path: "/reports", icon: BarChart3, label: "Reports" },
  { path: "/analytics", icon: TrendingUp, label: "Analytics" },
  { path: "/ai", icon: Brain, label: "AI Features" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <div
      className="w-64 h-screen flex flex-col border-r"
      style={{
        background: "var(--iq-sidebar-bg)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--iq-border)",
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "var(--iq-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--iq-accent-grad)" }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.2, color: "var(--iq-text-1)" }}>
              ExpenseIQ
            </h1>
            <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Family Finance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === "/"}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer"
                style={{
                  background: isActive ? "var(--iq-accent-s2)" : "transparent",
                  border: isActive ? "1px solid var(--iq-accent-b)" : "1px solid transparent",
                }}
              >
                <item.icon
                  className="w-5 h-5"
                  style={{ color: isActive ? "var(--iq-accent)" : "var(--iq-text-4)" }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--iq-text-1)" : "var(--iq-text-3)",
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--iq-accent)" }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t" style={{ borderColor: "var(--iq-border)" }}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "var(--iq-surface)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "var(--iq-accent-grad)", fontSize: "12px", fontWeight: 700 }}
          >
            AJ
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-2)" }}>Alex Johnson</p>
            <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Admin</p>
          </div>
          <LogOut className="w-4 h-4 cursor-pointer" style={{ color: "var(--iq-text-4)" }} />
        </div>
      </div>
    </div>
  );
}