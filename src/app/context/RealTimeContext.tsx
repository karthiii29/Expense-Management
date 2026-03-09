import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  expenses as initialExpenses,
  Expense, monthlyIncome, totalInvestments as initInvestments,
} from "../data/mockData";

interface RealTimeContextType {
  liveExpenses: Expense[];
  addLiveExpense: (expense: Expense) => void;
  manualRefresh: () => void;
  lastUpdated: Date;
  isRefreshing: boolean;
  secondsAgo: number;
  totalLiveExpenses: number;
  totalLiveInvestments: number;
  totalLiveBalance: number;
  liveSavingsRate: number;
  pulseKey: number;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const [liveExpenses, setLiveExpenses] = useState<Expense[]>(initialExpenses);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalLiveExpenses = liveExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLiveInvestments = initInvestments;
  const totalLiveBalance = monthlyIncome - totalLiveExpenses - totalLiveInvestments;
  const liveSavingsRate = parseFloat(
    ((totalLiveBalance / monthlyIncome) * 100).toFixed(1)
  );

  const addLiveExpense = useCallback((expense: Expense) => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLiveExpenses((prev) => [expense, ...prev]);
      setLastUpdated(new Date());
      setSecondsAgo(0);
      setPulseKey((k) => k + 1);
      setIsRefreshing(false);
    }, 480);
  }, []);

  const manualRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setSecondsAgo(0);
      setPulseKey((k) => k + 1);
      setIsRefreshing(false);
    }, 600);
  }, [isRefreshing]);

  // Tick seconds since last update
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <RealTimeContext.Provider
      value={{
        liveExpenses,
        addLiveExpense,
        manualRefresh,
        lastUpdated,
        isRefreshing,
        secondsAgo,
        totalLiveExpenses,
        totalLiveInvestments,
        totalLiveBalance,
        liveSavingsRate,
        pulseKey,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTime() {
  const ctx = useContext(RealTimeContext);
  if (!ctx) throw new Error("useRealTime must be used inside <RealTimeProvider>");
  return ctx;
}