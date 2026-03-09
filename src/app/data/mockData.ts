export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Utilities"
  | "Education"
  | "Travel"
  | "Investment"
  | "Other";

export type PaymentMode = "UPI" | "Card" | "Cash" | "Bank Transfer";

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Editor" | "Viewer";
  color: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  paymentMode: PaymentMode;
  paidBy: string;
  splitWith: { memberId: string; amount: number }[];
  notes?: string;
  receipt?: string;
  recurring: boolean;
  recurringFrequency?: "Daily" | "Weekly" | "Monthly";
}

export interface Investment {
  id: string;
  title: string;
  amount: number;
  returns: number;
  date: string;
  type: "Mutual Fund" | "Stock" | "FD" | "PPF" | "Crypto";
}

export const familyMembers: FamilyMember[] = [
  { id: "1", name: "Arjun Sharma", email: "arjun@family.com", avatar: "AS", role: "Admin",  color: "#00D4FF" },
  { id: "2", name: "Priya Sharma", email: "priya@family.com", avatar: "PS", role: "Editor", color: "#8B5CF6" },
  { id: "3", name: "Rohan Sharma", email: "rohan@family.com", avatar: "RS", role: "Viewer", color: "#10B981" },
  { id: "4", name: "Ananya Sharma",email: "ananya@family.com",avatar: "AN", role: "Viewer", color: "#F59E0B" },
];

// 20 realistic Indian middle-class transactions for February 2026
// Total ≈ ₹29,584
export const expenses: Expense[] = [
  {
    id: "1",
    title: "D-Mart Weekly Groceries",
    amount: 1850,
    category: "Food & Dining",
    date: "2026-02-28",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [{ memberId: "2", amount: 925 }],
    notes: "Monthly grocery stock-up",
    recurring: false,
  },
  {
    id: "2",
    title: "BESCOM Electricity Bill",
    amount: 1550,
    category: "Utilities",
    date: "2026-02-27",
    paymentMode: "Bank Transfer",
    paidBy: "2",
    splitWith: [{ memberId: "1", amount: 775 }],
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: "3",
    title: "Petrol (Bike + Car)",
    amount: 2800,
    category: "Transport",
    date: "2026-02-26",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [],
    notes: "Full tank for both vehicles",
    recurring: false,
  },
  {
    id: "4",
    title: "Zomato Dinner Order",
    amount: 680,
    category: "Food & Dining",
    date: "2026-02-25",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [],
    recurring: false,
  },
  {
    id: "5",
    title: "Jio Fiber Broadband",
    amount: 699,
    category: "Utilities",
    date: "2026-02-24",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [{ memberId: "2", amount: 349 }],
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: "6",
    title: "Flipkart (Shirt + Earrings)",
    amount: 1899,
    category: "Shopping",
    date: "2026-02-23",
    paymentMode: "Card",
    paidBy: "2",
    splitWith: [],
    recurring: false,
  },
  {
    id: "7",
    title: "Gym Membership",
    amount: 1200,
    category: "Health",
    date: "2026-02-22",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [{ memberId: "3", amount: 600 }],
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: "8",
    title: "Kids School Tuition",
    amount: 2500,
    category: "Education",
    date: "2026-02-21",
    paymentMode: "Bank Transfer",
    paidBy: "1",
    splitWith: [],
    notes: "Monthly tuition fee",
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: "9",
    title: "Family Dinner – Biryani House",
    amount: 2200,
    category: "Food & Dining",
    date: "2026-02-20",
    paymentMode: "Card",
    paidBy: "1",
    splitWith: [
      { memberId: "2", amount: 733 },
      { memberId: "3", amount: 733 },
    ],
    notes: "Monthly family outing",
    recurring: false,
  },
  {
    id: "10",
    title: "Airtel Mobile Recharge (×2)",
    amount: 598,
    category: "Utilities",
    date: "2026-02-19",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [],
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: "11",
    title: "Pharmacy – Medicines",
    amount: 720,
    category: "Health",
    date: "2026-02-18",
    paymentMode: "Cash",
    paidBy: "2",
    splitWith: [],
    notes: "BP tablets + vitamins",
    recurring: false,
  },
  {
    id: "12",
    title: "Ola / Uber Monthly Rides",
    amount: 1200,
    category: "Transport",
    date: "2026-02-17",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [],
    recurring: false,
  },
  {
    id: "13",
    title: "Swiggy (3 orders)",
    amount: 980,
    category: "Food & Dining",
    date: "2026-02-15",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [],
    recurring: false,
  },
  {
    id: "14",
    title: "Coorg Weekend Trip",
    amount: 5500,
    category: "Travel",
    date: "2026-02-13",
    paymentMode: "Card",
    paidBy: "1",
    splitWith: [
      { memberId: "2", amount: 1375 },
      { memberId: "3", amount: 1375 },
      { memberId: "4", amount: 1375 },
    ],
    notes: "Valentine's weekend getaway",
    recurring: false,
  },
  {
    id: "15",
    title: "Amazon – Household Essentials",
    amount: 1650,
    category: "Shopping",
    date: "2026-02-11",
    paymentMode: "Card",
    paidBy: "2",
    splitWith: [],
    recurring: false,
  },
  {
    id: "16",
    title: "Netflix + Amazon Prime",
    amount: 799,
    category: "Entertainment",
    date: "2026-02-10",
    paymentMode: "Card",
    paidBy: "1",
    splitWith: [{ memberId: "2", amount: 399 }],
    recurring: true,
    recurringFrequency: "Monthly",
  },
  {
    id: "17",
    title: "Metro Pass + Auto Fare",
    amount: 450,
    category: "Transport",
    date: "2026-02-08",
    paymentMode: "Cash",
    paidBy: "1",
    splitWith: [],
    recurring: false,
  },
  {
    id: "18",
    title: "BigBasket Weekly Order",
    amount: 1380,
    category: "Food & Dining",
    date: "2026-02-06",
    paymentMode: "UPI",
    paidBy: "1",
    splitWith: [],
    recurring: false,
  },
  {
    id: "19",
    title: "Udemy + Coursera Course",
    amount: 649,
    category: "Education",
    date: "2026-02-04",
    paymentMode: "Card",
    paidBy: "3",
    splitWith: [],
    notes: "React & System Design course",
    recurring: false,
  },
  {
    id: "20",
    title: "Evening Snacks / Chai Stall",
    amount: 280,
    category: "Food & Dining",
    date: "2026-02-02",
    paymentMode: "Cash",
    paidBy: "1",
    splitWith: [],
    recurring: false,
  },
];

// Monthly SIPs + PPF + Gold ETF + RD  (total = ₹17,500)
export const investments: Investment[] = [
  { id: "1", title: "SIP – Nifty 50 Index Fund",        amount: 6000,  returns: 13.2, date: "2026-02-01", type: "Mutual Fund" },
  { id: "2", title: "SIP – HDFC Mid Cap Opportunities", amount: 3500,  returns: 16.8, date: "2026-02-01", type: "Mutual Fund" },
  { id: "3", title: "PPF Account (Monthly)",            amount: 2000,  returns: 7.1,  date: "2026-02-10", type: "PPF" },
  { id: "4", title: "Nippon Gold ETF",                  amount: 2500,  returns: 9.4,  date: "2026-02-12", type: "Stock" },
  { id: "5", title: "SBI Recurring Deposit",            amount: 3500,  returns: 6.9,  date: "2026-02-01", type: "FD" },
];

// 6-month history — Diwali (Nov) and Dussehra (Oct) spikes are realistic
export const monthlyData = [
  { month: "Sep", expenses: 26800, investments: 12000, income: 78000 },
  { month: "Oct", expenses: 29500, investments: 13500, income: 78000 },
  { month: "Nov", expenses: 38000, investments: 14000, income: 80000 }, // Diwali shopping spike
  { month: "Dec", expenses: 31500, investments: 15000, income: 80000 },
  { month: "Jan", expenses: 27800, investments: 16000, income: 80000 },
  { month: "Feb", expenses: 29584, investments: 17500, income: 80000 },
];

// Category totals derived from expense list above
// Food: 1850+680+2200+980+1380+280 = 7370
// Transport: 2800+1200+450 = 4450
// Shopping: 1899+1650 = 3549
// Entertainment: 799
// Health: 1200+720 = 1920
// Utilities: 1550+699+598 = 2847
// Education: 2500+649 = 3149
// Travel: 5500
// Total = 29,584
export const categoryData = [
  { name: "Food & Dining", value: 7370,  color: "#00D4FF", percentage: 24.9 },
  { name: "Transport",     value: 4450,  color: "#8B5CF6", percentage: 15.0 },
  { name: "Shopping",      value: 3549,  color: "#F59E0B", percentage: 12.0 },
  { name: "Entertainment", value: 799,   color: "#EC4899", percentage: 2.7  },
  { name: "Health",        value: 1920,  color: "#10B981", percentage: 6.5  },
  { name: "Utilities",     value: 2847,  color: "#3B82F6", percentage: 9.6  },
  { name: "Education",     value: 3149,  color: "#6366F1", percentage: 10.6 },
  { name: "Travel",        value: 5500,  color: "#14B8A6", percentage: 18.6 },
];

// Daily spend samples for timeline chart (Feb 2026)
export const spendingTrendData = [
  { day: "Feb 2",  amount: 280  },
  { day: "Feb 4",  amount: 649  },
  { day: "Feb 6",  amount: 1380 },
  { day: "Feb 8",  amount: 450  },
  { day: "Feb 10", amount: 799  },
  { day: "Feb 11", amount: 1650 },
  { day: "Feb 13", amount: 5500 }, // Coorg trip — peak
  { day: "Feb 15", amount: 980  },
  { day: "Feb 17", amount: 1200 },
  { day: "Feb 19", amount: 2798 }, // dinner + mobile recharge
  { day: "Feb 21", amount: 3700 }, // tuition + gym
  { day: "Feb 24", amount: 3699 }, // petrol + Jio
  { day: "Feb 26", amount: 2800 },
  { day: "Feb 28", amount: 1850 },
];

// Net settlement amounts between family members
export const settlementData = [
  { from: "2", to: "1", amount: 1658, status: "pending"  }, // Priya owes Arjun (grocery + dinner splits)
  { from: "3", to: "1", amount: 2708, status: "pending"  }, // Rohan owes Arjun (trip + dinner + gym)
  { from: "4", to: "1", amount: 1375, status: "pending"  }, // Ananya owes Arjun (trip split)
  { from: "1", to: "2", amount: 775,  status: "settled"  }, // Arjun settled electricity split to Priya
];

export const insights = [
  { id: "1", text: "Food & Dining at ₹7,370 is your largest category — 24.9% of total spend this month.", type: "warning", icon: "utensils"     },
  { id: "2", text: "Monthly SIPs of ₹9,500 growing steadily — your portfolio is up 13.2% YTD. 🚀",         type: "success", icon: "trending-up"  },
  { id: "3", text: "Travel spiked to ₹5,500 this month due to Valentine's Coorg weekend getaway.",          type: "info",    icon: "plane"        },
  { id: "4", text: "You saved ₹32,916 this month — a healthy 41.1% savings rate. Keep it up! 🎯",           type: "success", icon: "piggy-bank"   },
  { id: "5", text: "Transport rose 8.5% vs last month — consider carpooling or metro more often.",           type: "warning", icon: "car"          },
  { id: "6", text: "Utilities well controlled at ₹2,847 — within your ₹3,500 monthly budget. ✅",           type: "success", icon: "zap"          },
];

export const CATEGORIES: Category[] = [
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Health", "Utilities", "Education", "Travel", "Investment", "Other"
];

export const PAYMENT_MODES: PaymentMode[] = ["UPI", "Card", "Cash", "Bank Transfer"];

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    "Food & Dining": "🍽️",
    "Transport":     "🚗",
    "Shopping":      "🛍️",
    "Entertainment": "🎬",
    "Health":        "💊",
    "Utilities":     "⚡",
    "Education":     "📚",
    "Travel":        "✈️",
    "Investment":    "📈",
    "Other":         "📌",
  };
  return icons[category] || "📌";
};

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    "Food & Dining": "#00D4FF",
    "Transport":     "#8B5CF6",
    "Shopping":      "#F59E0B",
    "Entertainment": "#EC4899",
    "Health":        "#10B981",
    "Utilities":     "#3B82F6",
    "Education":     "#6366F1",
    "Travel":        "#14B8A6",
    "Investment":    "#22C55E",
    "Other":         "#94A3B8",
  };
  return colors[category] || "#94A3B8";
};

export const totalExpenses    = expenses.reduce((sum, e) => sum + e.amount, 0);       // 29,584
export const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);    // 17,500
export const monthlyIncome    = 80000;
export const totalBalance     = monthlyIncome - totalExpenses - totalInvestments;     // 32,916
