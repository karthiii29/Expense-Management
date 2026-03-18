import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { AddExpenseModal } from "../AddExpenseModal";
import { AnimatePresence } from "motion/react";
import { PageTransition } from "../shared/PageTransition";

export function AppLayout() {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--iq-bg)" }}>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 relative">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet context={{ openAddExpense: () => setAddExpenseOpen(true) }} />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal open={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} />
    </div>
  );
}