import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Receipt,
  Brain,
  TrendingUp,
  Settings,
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Home" },
  { path: "/expenses", icon: Receipt, label: "Expenses" },
  { path: "/ai", icon: Brain, label: "AI" },
  { path: "/analytics", icon: TrendingUp, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-2 border-t"
      style={{
        background: "var(--iq-sidebar-bg)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--iq-border-s)",
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} end={item.path === "/"}>
          {({ isActive }) => (
            <div className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
              <item.icon
                className="w-5 h-5"
                style={{ color: isActive ? "var(--iq-accent)" : "var(--iq-text-4)" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--iq-accent)" : "var(--iq-text-4)",
                }}
              >
                {item.label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}