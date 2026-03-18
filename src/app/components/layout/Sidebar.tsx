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
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { path: "/",          icon: LayoutDashboard, label: "Dashboard" },
  { path: "/expenses",  icon: Receipt,         label: "Expenses"  },
  { path: "/family",    icon: Users,           label: "Family"    },
  { path: "/reports",   icon: BarChart3,       label: "Reports"   },
  { path: "/analytics", icon: TrendingUp,      label: "Analytics" },
  { path: "/ai",        icon: Brain,           label: "AI Features"},
  { path: "/settings",  icon: Settings,        label: "Settings"  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-6 border-b"
        style={{ borderColor: "var(--iq-border)" }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--iq-accent-grad)" }}
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.2, color: "var(--iq-text-1)" }}>
              ExpenseIQ
            </h1>
            <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Family Finance</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto" style={{ position: "relative" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {navItems.map((item) => (
            <motion.div key={item.path} variants={itemVariants}>
              <NavLink to={item.path} end={item.path === "/"}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer overflow-hidden"
                    style={{
                      background: isActive ? "var(--iq-accent-s2)" : "transparent",
                      border: isActive ? "1px solid var(--iq-accent-b)" : "1px solid transparent",
                    }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Active glow background */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="active-bg"
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: "var(--iq-accent-s)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    <item.icon
                      className="w-5 h-5 relative z-10"
                      style={{ color: isActive ? "var(--iq-accent)" : "var(--iq-text-4)" }}
                    />
                    <span
                      className="relative z-10"
                      style={{
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "var(--iq-text-1)" : "var(--iq-text-3)",
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Animated active dot */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="active-dot"
                          layoutId="sidebar-active-dot"
                          className="ml-auto w-1.5 h-1.5 rounded-full relative z-10 animate-pulse-glow"
                          style={{ background: "var(--iq-accent)" }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom fade gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--iq-sidebar-bg))" }}
        />
      </nav>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="p-4 border-t"
        style={{ borderColor: "var(--iq-border)" }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
          style={{ background: "var(--iq-surface)" }}
          transition={{ duration: 0.18 }}
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
          <motion.div whileHover={{ scale: 1.2, color: "#EF4444" }} transition={{ duration: 0.15 }}>
            <LogOut className="w-4 h-4 cursor-pointer" style={{ color: "var(--iq-text-4)" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}