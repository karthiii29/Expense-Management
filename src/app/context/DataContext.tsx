import { createContext, useContext, type ReactNode } from "react";
import {
  expenses as mockExpenses,
  categoryData as mockCategoryData,
  monthlyData as mockMonthlyData,
  monthlyIncome as mockMonthlyIncome,
  familyMembers as mockFamilyMembers,
  settlementData as mockSettlementData,
  type Expense,
  type FamilyMember,
} from "../data/mockData";

interface CategoryDataItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface MonthlyDataItem {
  month: string;
  expenses: number;
  investments: number;
  income: number;
}

interface DataContextValue {
  expenses: Expense[];
  categoryData: CategoryDataItem[];
  monthlyData: MonthlyDataItem[];
  monthlyIncome: number;
  familyMembers: FamilyMember[];
  settlementData: any[]; // Or Settlement[] if exported properly
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const value: DataContextValue = {
    expenses: mockExpenses,
    categoryData: mockCategoryData,
    monthlyData: mockMonthlyData,
    monthlyIncome: mockMonthlyIncome,
    familyMembers: mockFamilyMembers,
    settlementData: mockSettlementData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
