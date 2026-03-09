import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, Camera, Tag, Bot, AlertTriangle, RefreshCw,
  Send, CheckCircle, Sparkles, Target, Activity,
  Shield, MessageCircle, Cpu, ChevronRight,
  TrendingUp, Users, ScanLine, BarChart2, Zap,
} from "lucide-react";
import { useRealTime } from "../context/RealTimeContext";
import { LiveIndicator } from "../components/ui/LiveIndicator";
import { monthlyIncome, totalExpenses, totalInvestments } from "../data/mockData";

/* ─── Data ───────────────────────────────────────────────────────────── */
const HEALTH_SCORE = 78;
const SUB_SCORES = [
  { label: "Expense Control", score: 72, color: "#F59E0B", desc: "37% of income spent — target <35%" },
  { label: "Savings Rate",    score: 85, color: "#10B981", desc: "41.1% saved monthly — excellent!" },
  { label: "Investment Rate", score: 78, color: "#00D4FF", desc: "21.9% invested — on track" },
  { label: "Stability",       score: 75, color: "#8B5CF6", desc: "Moderate month-to-month variance" },
];

const CATEGORY_PATTERNS = [
  { patterns: ["dominos","pizza","zomato","swiggy","biryani","restaurant","food","cafe","chai","lunch","dinner","breakfast","dhaba"], category: "Food & Dining", icon: "🍽️", color: "#00D4FF", confidence: 98 },
  { patterns: ["uber","ola","petrol","cab","metro","auto","bus","rickshaw","fuel","rapido"],                                          category: "Transport",     icon: "🚗", color: "#8B5CF6", confidence: 96 },
  { patterns: ["netflix","prime","hotstar","spotify","youtube","movie","cinema","game"],                                               category: "Entertainment", icon: "🎬", color: "#EC4899", confidence: 99 },
  { patterns: ["amazon","flipkart","myntra","meesho","shopping","clothes","shoes","ajio"],                                             category: "Shopping",      icon: "🛍️", color: "#F59E0B", confidence: 94 },
  { patterns: ["gym","pharmacy","medicine","doctor","hospital","health","fitness","yoga"],                                             category: "Health",        icon: "💊", color: "#10B981", confidence: 97 },
  { patterns: ["electricity","bescom","internet","jio","airtel","mobile","recharge","wifi"],                                          category: "Utilities",     icon: "⚡", color: "#3B82F6", confidence: 95 },
  { patterns: ["tuition","course","school","college","book","udemy","coursera","education"],                                          category: "Education",     icon: "📚", color: "#6366F1", confidence: 93 },
  { patterns: ["hotel","flight","trip","travel","coorg","goa","holiday","booking"],                                                   category: "Travel",        icon: "✈️", color: "#14B8A6", confidence: 97 },
];

const RECEIPT_FIELDS = [
  { label: "Merchant",  value: "Big Bazaar, Koramangala"  },
  { label: "Amount",    value: "₹1,248"                   },
  { label: "Date",      value: "28 Feb 2026, 6:42 PM"     },
  { label: "Category",  value: "🍽️  Food & Dining"        },
  { label: "GST (18%)", value: "₹224 included"            },
  { label: "Items",     value: "14 line items detected"   },
];

const INITIAL_CHAT = [
  { role: "ai" as const, text: "Hello Arjun! 👋 I'm your AI Finance Advisor. I've analysed your February 2026 data." },
  { role: "ai" as const, text: "📊 You spent ₹29,584 this month — 37% of your ₹80k income. That's healthy!" },
  { role: "ai" as const, text: "🚨 Food & Dining (₹7,370) is your #1 expense category at 24.9% of spend. Meal prepping could save ~₹1,500/month." },
];

const AI_RESPONSES = [
  "💡 Your Coorg trip (₹5,500) was 18.6% of total spend. Planning travels mid-month can help balance cash flow.",
  "📈 Your Nifty 50 SIP of ₹6,000 is compounding at 13.2% — stay consistent for 10 years and it triples!",
  "⚡ Utilities at ₹2,847 are well within your ₹3,500 budget. Switching to LED lights could save another ₹200.",
  "🎯 At a 41.1% savings rate, you're saving ₹32,916/month. Consider parking the surplus in a liquid mutual fund.",
  "🏥 Health spending (₹1,920) is under budget (₹2,500) — great preventive care discipline!",
  "📚 Your ₹3,149 education investment is ROI-positive. Udemy skills can translate to a 15–20% income boost.",
];

const SUBSCRIPTIONS = [
  { name: "School Tuition",     amount: 2500, yearly: 30000, color: "#F59E0B", icon: "📚" },
  { name: "Gym Membership",     amount: 1200, yearly: 14400, color: "#10B981", icon: "💪" },
  { name: "Netflix + Prime",    amount: 799,  yearly: 9588,  color: "#EC4899", icon: "🎬" },
  { name: "Jio Fiber",          amount: 699,  yearly: 8388,  color: "#00D4FF", icon: "📡" },
  { name: "Airtel Recharge ×2", amount: 598,  yearly: 7176,  color: "#8B5CF6", icon: "📱" },
];

const ANOMALIES = [
  { id: "a1", title: "Fuel expense spike",       normal: "₹1,400–1,800", detected: "₹2,800", change: "+67%",    icon: "⛽", severity: "medium" as const, date: "Feb 26" },
  { id: "a2", title: "Shopping above pattern",   normal: "₹800–1,200",   detected: "₹1,899", change: "+58%",    icon: "🛍️", severity: "low"    as const, date: "Feb 23" },
  { id: "a3", title: "First travel in 3 months", normal: "₹0",           detected: "₹5,500", change: "New",     icon: "✈️", severity: "high"   as const, date: "Feb 13" },
];

const NLP_COMMANDS = [
  { text: "Show food expenses last 3 months", icon: "🍽️" },
  { text: "How much did I spend on Amazon?",  icon: "📦" },
  { text: "Split ₹2,400 dinner for 4 people", icon: "👥" },
  { text: "What is my top category?",         icon: "📊" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  "Live": { bg: "rgba(16,185,129,0.15)",  color: "#10B981" },
  "Beta": { bg: "rgba(0,212,255,0.15)",   color: "#00D4FF" },
  "Soon": { bg: "rgba(245,158,11,0.15)",  color: "#F59E0B" },
};

const AI_FEATURE_CARDS = [
  { num: "01", title: "Receipt AI",         desc: "Scan & auto-fill",          icon: Camera,        color: "#00D4FF", status: "Beta", bg: "rgba(0,212,255,0.08)"    },
  { num: "02", title: "Auto Category",      desc: "Zero-friction tagging",     icon: Tag,           color: "#8B5CF6", status: "Live", bg: "rgba(139,92,246,0.08)"   },
  { num: "03", title: "Smart Insights",     desc: "AI advisor chat",           icon: MessageCircle, color: "#10B981", status: "Live", bg: "rgba(16,185,129,0.08)"   },
  { num: "04", title: "Budget Risk",        desc: "Predictive alerts",         icon: Target,        color: "#EF4444", status: "Live", bg: "rgba(239,68,68,0.08)"    },
  { num: "05", title: "Split AI",           desc: "Fair weighted split",       icon: Users,         color: "#F59E0B", status: "Soon", bg: "rgba(245,158,11,0.08)"   },
  { num: "06", title: "Anomaly Guard",      desc: "Unusual spend detection",   icon: Shield,        color: "#EC4899", status: "Beta", bg: "rgba(236,72,153,0.08)"   },
  { num: "07", title: "Subscription AI",    desc: "Detect recurring charges",  icon: RefreshCw,     color: "#14B8A6", status: "Live", bg: "rgba(20,184,166,0.08)"   },
  { num: "08", title: "Investment Nudge",   desc: "Behavioural savings cues",  icon: TrendingUp,    color: "#22C55E", status: "Soon", bg: "rgba(34,197,94,0.08)"    },
  { num: "09", title: "Health Score",       desc: "Gamified finance score",    icon: Activity,      color: "#6366F1", status: "Live", bg: "rgba(99,102,241,0.08)"   },
  { num: "10", title: "NLP Commands",       desc: "Talk to your data",         icon: Bot,           color: "#00D4FF", status: "Beta", bg: "rgba(0,212,255,0.06)"    },
];

function buildNLPResponse(query: string) {
  const q = query.toLowerCase();
  if (q.includes("food") || q.includes("dining") || q.includes("eat"))
    return { type: "chart", title: "Food & Dining — Last 3 Months", months: [{ m: "Dec", v: 6100 }, { m: "Jan", v: 6800 }, { m: "Feb", v: 7370 }], insight: "↑ 8.4% increase vs January. Peak spend: Family Dinner ₹2,200 on Feb 20." };
  if (q.includes("amazon"))
    return { type: "amount", title: "Amazon Spending (Feb 2026)", amount: "₹1,650", date: "Feb 11, 2026", category: "Shopping 🛍️", note: "2 orders detected — Household essentials" };
  if (q.includes("split") || q.includes("dinner") || q.includes("4 people"))
    return { type: "split", amount: 2400, people: 4, each: 600, suggestion: "Arjun ₹600 · Priya ₹600 · Rohan ₹600 · Ananya ₹600" };
  if (q.includes("top") || q.includes("category") || q.includes("highest"))
    return { type: "category", name: "Food & Dining", amount: "₹7,370", percent: "24.9%", trend: "↑ 8.4% vs Jan", color: "#00D4FF" };
  return { type: "help", suggestions: ["Try: 'Show food expenses last 3 months'", "Try: 'How much did I spend on Amazon?'", "Try: 'Split ₹2,400 dinner for 4 people'", "Try: 'What is my top category?'"] };
}

/* ─── Financial Health Gauge ─────────────────────────────────────────── */
function HealthGauge({ score }: { score: number }) {
  const R = 76;
  const C = 2 * Math.PI * R;        // full circumference ≈ 477.5
  const arc = C * 0.75;             // 270-degree visible track ≈ 358.1
  const fill = (score / 100) * arc; // score fill ≈ 279.3 for 78
  return (
    <svg width={200} height={200} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="hgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#10B981" />
          <stop offset="50%"  stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Background track */}
      <circle
        cx={100} cy={100} r={R}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${arc} ${C - arc}`}
        transform="rotate(135 100 100)"
      />
      {/* Score fill — animates from 0 → fill */}
      <motion.circle
        cx={100} cy={100} r={R}
        fill="none"
        stroke="url(#hgGrad)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${fill} ${C - fill}`}
        transform="rotate(135 100 100)"
        strokeDashoffset={fill}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
        style={{ filter: "drop-shadow(0 0 10px rgba(0,212,255,0.5))" }}
      />
      {/* Center labels */}
      <text x={100} y={86}  textAnchor="middle" fontSize={42} fontWeight={700} fill="white">{score}</text>
      <text x={100} y={106} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.38)">/100</text>
      <text x={100} y={126} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10B981">B+ · Good Health</text>
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export function AIFeatures() {
  const [categoryInput, setCategoryInput]     = useState("");
  const [predicted, setPredicted]             = useState<typeof CATEGORY_PATTERNS[0] | null>(null);
  const [scanning, setScanning]               = useState(false);
  const [scanned, setScanned]                 = useState(false);
  const [chat, setChat]                       = useState(INITIAL_CHAT);
  const [aiTyping, setAiTyping]               = useState(false);
  const [aiIndex, setAiIndex]                 = useState(0);
  const [nlpQuery, setNlpQuery]               = useState("");
  const [nlpResp, setNlpResp]                 = useState<ReturnType<typeof buildNLPResponse> | null>(null);
  const [nlpLoading, setNlpLoading]           = useState(false);
  const [dismissed, setDismissed]             = useState<string[]>([]);
  const chatEndRef                            = useRef<HTMLDivElement>(null);
  const { isRefreshing, secondsAgo }          = useRealTime();

  // Auto-predict category
  useEffect(() => {
    if (!categoryInput.trim()) { setPredicted(null); return; }
    const lower = categoryInput.toLowerCase();
    const match = CATEGORY_PATTERNS.find((p) => p.patterns.some((pat) => lower.includes(pat)));
    setPredicted(match ?? null);
  }, [categoryInput]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, aiTyping]);

  const handleScan = () => {
    if (scanned) { setScanned(false); return; }
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); }, 2200);
  };

  const handleAskAI = () => {
    if (aiTyping) return;
    setAiTyping(true);
    setTimeout(() => {
      setChat((prev) => [...prev, { role: "ai", text: AI_RESPONSES[aiIndex % AI_RESPONSES.length] }]);
      setAiIndex((i) => i + 1);
      setAiTyping(false);
    }, 1400);
  };

  const handleNLP = (q?: string) => {
    const query = q ?? nlpQuery;
    if (!query.trim()) return;
    setNlpLoading(true);
    setNlpResp(null);
    setTimeout(() => {
      setNlpResp(buildNLPResponse(query));
      setNlpLoading(false);
    }, 1100);
    if (!q) setNlpQuery("");
  };

  const totalYearlySubs = SUBSCRIPTIONS.reduce((s, sub) => s + sub.yearly, 0);
  const savings         = monthlyIncome - totalExpenses - totalInvestments;

  return (
    <div className="min-h-screen" style={{ background: "var(--iq-bg)" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 px-4 lg:px-8 py-4 flex items-center justify-between"
        style={{ background: "var(--iq-header)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--iq-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(0,212,255,0.3)" }}
          >
            <Brain className="w-5 h-5" style={{ color: "#00D4FF" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--iq-text-1)" }}>AI Intelligence</h1>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>10 smart modules · real-time analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full"
            style={{ fontSize: "11px", background: "rgba(0,212,255,0.12)", color: "#00D4FF", fontWeight: 700, border: "1px solid rgba(0,212,255,0.25)" }}
          >
            ✦ AI BETA
          </span>
          <LiveIndicator secondsAgo={secondsAgo} isRefreshing={isRefreshing} />
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6 space-y-6">

        {/* ── 1. Financial Health Score ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(0,212,255,0.07) 0%, transparent 55%)" }} />
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5" style={{ color: "#10B981" }} />
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--iq-text-1)" }}>Financial Health Score</h2>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", background: "rgba(16,185,129,0.15)", color: "#10B981", fontWeight: 700 }}>LIVE</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Gauge */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <HealthGauge score={HEALTH_SCORE} />
              <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginTop: "2px" }}>Overall · February 2026</p>
            </div>
            {/* Sub-scores */}
            <div className="flex-1 w-full space-y-4">
              {SUB_SCORES.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.12 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "13px", color: "var(--iq-text-2)" }}>{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{s.desc}</span>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>{s.score}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--iq-progress)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ delay: 0.9 + i * 0.12, duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                </motion.div>
              ))}
              {/* Grade chips */}
              <div className="flex gap-2 flex-wrap pt-2">
                {[
                  { label: "Grade",   value: "B+",       color: "#10B981" },
                  { label: "Status",  value: "Good",     color: "#00D4FF" },
                  { label: "Rank",    value: "Top 32%",  color: "#8B5CF6" },
                  { label: "Trend",   value: "↑ +3 pts", color: "#F59E0B" },
                ].map((g) => (
                  <div key={g.label} className="flex-1 min-w-[72px] px-3 py-2 rounded-xl text-center" style={{ background: g.color + "12", border: `1px solid ${g.color}25` }}>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: g.color }}>{g.value}</p>
                    <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Feature Cards Grid ───────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: "#8B5CF6" }} />
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--iq-text-1)" }}>AI Feature Suite</h2>
            <span style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>— 10 intelligent modules</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {AI_FEATURE_CARDS.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="rounded-2xl p-4 relative overflow-hidden cursor-pointer"
                style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-25 blur-xl pointer-events-none"
                  style={{ background: f.color, transform: "translate(30%, -30%)" }} />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: f.bg, border: `1px solid ${f.color}30` }}>
                  <f.icon style={{ color: f.color, width: "17px", height: "17px" }} />
                </div>
                <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginBottom: "1px" }}>{f.num}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--iq-text-1)", lineHeight: 1.3 }}>{f.title}</p>
                <p style={{ fontSize: "11px", color: "var(--iq-text-4)", marginTop: "2px", lineHeight: 1.4 }}>{f.desc}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full"
                  style={{ fontSize: "9px", fontWeight: 700, ...STATUS_STYLE[f.status] }}>
                  {f.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 3. Category Predictor + Receipt AI ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Auto-Category Predictor */}
          <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4" style={{ color: "#8B5CF6" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Auto Category Prediction</h3>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", ...STATUS_STYLE["Live"], fontWeight: 700 }}>LIVE</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "14px" }}>Type any expense — AI predicts category in real-time</p>

            {/* Input */}
            <div className="relative mb-4">
              <input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="e.g. Dominos 540, Uber 230, Netflix…"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: predicted ? `1px solid ${predicted.color}70` : "1px solid var(--iq-border)",
                  color: "var(--iq-text-1)",
                  fontSize: "14px",
                  transition: "border-color 0.2s",
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {categoryInput && !predicted && (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Brain className="w-4 h-4" style={{ color: "var(--iq-text-4)" }} />
                  </motion.div>
                )}
                {predicted && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: "18px" }}>
                    {predicted.icon}
                  </motion.span>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {predicted ? (
                <motion.div
                  key={predicted.category}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-xl"
                  style={{ background: predicted.color + "12", border: `1px solid ${predicted.color}30` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "26px" }}>{predicted.icon}</span>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: predicted.color }}>{predicted.category}</p>
                        <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>AI auto-detected</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full" style={{ background: "#10B98115", border: "1px solid #10B98130" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#10B981" }}>{predicted.confidence}% match</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl" style={{ background: predicted.color + "20", color: predicted.color, border: `1px solid ${predicted.color}35`, fontSize: "12px", fontWeight: 600 }}>
                      ✓ Apply Category
                    </button>
                    <button className="px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", color: "var(--iq-text-3)", fontSize: "12px" }}>
                      Override
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p style={{ fontSize: "11px", color: "var(--iq-text-4)", marginBottom: "6px" }}>Quick examples:</p>
                  {["Dominos 540", "Uber 230", "Netflix 199", "Gym membership"].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setCategoryInput(ex)}
                      className="block w-full text-left px-3 py-2.5 rounded-xl transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--iq-border)", fontSize: "12px", color: "var(--iq-text-3)" }}
                    >
                      {ex} <ChevronRight className="inline w-3 h-3 ml-1" style={{ color: "var(--iq-text-4)" }} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Receipt AI Scanner */}
          <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4" style={{ color: "#00D4FF" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Receipt AI Scanner</h3>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", ...STATUS_STYLE["Beta"], fontWeight: 700 }}>BETA</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "14px" }}>OCR + AI extraction · auto-fills all expense fields in 2 seconds</p>

            <AnimatePresence mode="wait">
              {!scanned && !scanning && (
                <motion.button
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  className="w-full py-10 rounded-xl flex flex-col items-center gap-3"
                  style={{ background: "rgba(0,212,255,0.04)", border: "2px dashed rgba(0,212,255,0.25)", cursor: "pointer" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.12)" }}>
                    <ScanLine className="w-7 h-7" style={{ color: "#00D4FF" }} />
                  </div>
                  <div className="text-center">
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#00D4FF" }}>Click to Scan Receipt</p>
                    <p style={{ fontSize: "11px", color: "var(--iq-text-4)", marginTop: "2px" }}>Simulates AI extraction demo</p>
                  </div>
                </motion.button>
              )}

              {scanning && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 rounded-xl flex flex-col items-center gap-4"
                  style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(0,212,255,0.18)" }}
                  >
                    <Brain className="w-7 h-7" style={{ color: "#00D4FF" }} />
                  </motion.div>
                  <div className="text-center">
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#00D4FF" }}>AI Reading Receipt…</p>
                    <p style={{ fontSize: "11px", color: "var(--iq-text-4)", marginTop: "2px" }}>OCR + field extraction in progress</p>
                  </div>
                  <div className="w-52 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.1, ease: "easeInOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #00D4FF, #8B5CF6)" }}
                    />
                  </div>
                </motion.div>
              )}

              {scanned && (
                <motion.div key="scanned" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#10B981" }}>Extraction Complete — 6 fields</span>
                    </div>
                    <button onClick={handleScan} style={{ fontSize: "11px", color: "var(--iq-text-4)", cursor: "pointer" }}>Reset ↺</button>
                  </div>
                  {RECEIPT_FIELDS.map((field, i) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--iq-border)" }}
                    >
                      <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{field.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-2)" }}>{field.value}</span>
                    </motion.div>
                  ))}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="w-full mt-1 py-2.5 rounded-xl"
                    style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(0,212,255,0.3)", color: "#00D4FF", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    ✓ Add Expense from Receipt
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── 4. AI Advisor Chat ──────────────────────────────────── */}
        <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" style={{ color: "#10B981" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>AI Finance Advisor</h3>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", ...STATUS_STYLE["Live"], fontWeight: 700 }}>LIVE</span>
            </div>
            <button
              onClick={handleAskAI}
              disabled={aiTyping}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: aiTyping ? "rgba(255,255,255,0.04)" : "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: "12px", fontWeight: 600, cursor: aiTyping ? "not-allowed" : "pointer", opacity: aiTyping ? 0.6 : 1 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {aiTyping ? "Thinking…" : "Ask AI"}
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <AnimatePresence>
              {chat.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i < 3 ? i * 0.08 : 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: msg.role === "ai" ? "rgba(16,185,129,0.18)" : "var(--iq-accent-s)",
                      border: msg.role === "ai" ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--iq-accent-b)",
                    }}
                  >
                    {msg.role === "ai"
                      ? <Bot className="w-4 h-4" style={{ color: "#10B981" }} />
                      : <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--iq-accent)" }}>AS</span>
                    }
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      background: msg.role === "ai" ? "rgba(16,185,129,0.07)" : "var(--iq-accent-s)",
                      border: msg.role === "ai" ? "1px solid rgba(16,185,129,0.15)" : "1px solid var(--iq-accent-b)",
                      maxWidth: "82%",
                    }}
                  >
                    <p style={{ fontSize: "13px", color: "var(--iq-text-2)", lineHeight: 1.6 }}>{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {aiTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <Bot className="w-4 h-4" style={{ color: "#10B981" }} />
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.65, delay: d * 0.14 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#10B981" }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* ── 5. Budget Risk + Subscription Tracker ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Budget Risk */}
          <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" style={{ color: "#EF4444" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Budget Risk Predictor</h3>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", ...STATUS_STYLE["Live"], fontWeight: 700 }}>LIVE</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "14px" }}>AI projects spend velocity for March 2026</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Daily Avg",    value: "₹1,056",  color: "var(--iq-accent)" },
                { label: "Proj. March",  value: "₹32.7k",  color: "#F59E0B"          },
                { label: "Budget Cap",   value: "₹35k",    color: "#10B981"          },
              ].map((s) => (
                <div key={s.label} className="px-2 py-2.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--iq-border)" }}>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>{s.value}</p>
                  <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginTop: "2px" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: "12px", color: "var(--iq-text-3)" }}>March spending trajectory</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#F59E0B" }}>93.5% of budget</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden relative" style={{ background: "var(--iq-progress)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "93.5%" }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #10B981, #F59E0B 65%, #EF4444)" }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Mar 1</span>
                <span style={{ fontSize: "10px", color: "#EF4444", fontWeight: 600 }}>Budget ₹35,000</span>
                <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Mar 31</span>
              </div>
            </div>

            <div className="p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#F59E0B" }}>AI Prediction · March 2026</p>
                  <p style={{ fontSize: "12px", color: "var(--iq-text-3)", marginTop: "3px", lineHeight: 1.55 }}>
                    At ₹1,056/day you'll hit your ₹35,000 limit by{" "}
                    <strong style={{ color: "#EF4444" }}>March 27</strong>.
                    Reduce daily spend by ₹80 to stay safely within budget. 🎯
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tracker */}
          <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" style={{ color: "#14B8A6" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Subscription Detector</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", background: "rgba(20,184,166,0.15)", color: "#14B8A6", fontWeight: 700 }}>AUTO-DETECTED</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "12px" }}>5 recurring patterns found in your transactions</p>

            <div className="space-y-2 mb-3">
              {SUBSCRIPTIONS.map((sub, i) => (
                <motion.div
                  key={sub.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--iq-border)" }}
                >
                  <span style={{ fontSize: "18px" }}>{sub.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--iq-text-2)" }} className="truncate">{sub.name}</p>
                    <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>₹{sub.yearly.toLocaleString("en-IN")} / yr</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p style={{ fontSize: "14px", fontWeight: 700, color: sub.color }}>₹{sub.amount.toLocaleString("en-IN")}</p>
                    <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>/ mo</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-3 rounded-xl" style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.22)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>Total yearly commitments</p>
                  <p style={{ fontSize: "24px", fontWeight: 700, color: "#14B8A6" }}>₹{totalYearlySubs.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#F59E0B" }}>
                    {((totalYearlySubs / (monthlyIncome * 12)) * 100).toFixed(1)}%
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>of annual income</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. Anomaly Detection ────────────────────────────────── */}
        <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color: "#EC4899" }} />
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Anomaly Detection</h3>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", ...STATUS_STYLE["Beta"], fontWeight: 700 }}>BETA</span>
            <span style={{ fontSize: "12px", color: "var(--iq-text-4)", marginLeft: "auto" }}>
              {ANOMALIES.length - dismissed.length} of {ANOMALIES.length} alerts active
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {dismissed.length < ANOMALIES.length ? (
              <motion.div key="alerts" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ANOMALIES.filter((a) => !dismissed.includes(a.id)).map((anomaly) => {
                  const sColor = anomaly.severity === "high" ? "#EF4444" : anomaly.severity === "medium" ? "#F59E0B" : "#8B5CF6";
                  return (
                    <motion.div
                      key={anomaly.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 rounded-xl"
                      style={{ background: sColor + "0D", border: `1px solid ${sColor}28` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "22px" }}>{anomaly.icon}</span>
                          <div>
                            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--iq-text-2)" }}>{anomaly.title}</p>
                            <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>{anomaly.date}</p>
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md" style={{ fontSize: "9px", fontWeight: 700, background: sColor + "20", color: sColor }}>
                          {anomaly.severity.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 px-2 py-1.5 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Normal</p>
                          <p style={{ fontSize: "11px", color: "var(--iq-text-3)" }}>{anomaly.normal}</p>
                        </div>
                        <span style={{ fontSize: "14px", color: "var(--iq-text-4)" }}>→</span>
                        <div className="flex-1 px-2 py-1.5 rounded-lg text-center" style={{ background: sColor + "15" }}>
                          <p style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Detected</p>
                          <p style={{ fontSize: "12px", fontWeight: 700, color: sColor }}>{anomaly.detected}</p>
                        </div>
                      </div>

                      <div className="px-2 py-1.5 rounded-lg text-center mb-3" style={{ background: sColor + "12" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: sColor }}>{anomaly.change} vs pattern</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setDismissed((d) => [...d, anomaly.id])}
                          className="flex-1 py-1.5 rounded-lg"
                          style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                        >
                          ✓ Verified
                        </button>
                        <button
                          onClick={() => setDismissed((d) => [...d, anomaly.id])}
                          className="flex-1 py-1.5 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                        >
                          🚨 Flag
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="clear"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center"
              >
                <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "#10B981" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#10B981" }}>All anomalies reviewed!</p>
                <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginTop: "4px" }}>Your transactions look normal 🎉</p>
                <button
                  onClick={() => setDismissed([])}
                  className="mt-4 px-5 py-2 rounded-xl"
                  style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  Reset Alerts
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 7. NLP Command Interface ────────────────────────────── */}
        <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5" style={{ color: "#00D4FF" }} />
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>Natural Language Interface</h3>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", ...STATUS_STYLE["Beta"], fontWeight: 700 }}>BETA</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--iq-text-4)", marginBottom: "14px" }}>Ask questions about your finances in plain English — like ChatGPT inside your app</p>

          {/* Input bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <input
                value={nlpQuery}
                onChange={(e) => setNlpQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNLP()}
                placeholder="Ask anything… e.g. 'Show food expenses last 3 months'"
                className="w-full px-4 py-3 pr-10 rounded-xl outline-none"
                style={{
                  background: "rgba(0,212,255,0.04)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "var(--iq-text-1)",
                  fontSize: "14px",
                }}
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(0,212,255,0.35)" }} />
            </div>
            <button
              onClick={() => handleNLP()}
              disabled={nlpLoading || !nlpQuery.trim()}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: nlpQuery.trim() ? "linear-gradient(135deg, #00D4FF, #8B5CF6)" : "rgba(255,255,255,0.05)",
                cursor: nlpQuery.trim() ? "pointer" : "not-allowed",
                transition: "background 0.2s",
              }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Quick command chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {NLP_COMMANDS.map((cmd) => (
              <button
                key={cmd.text}
                onClick={() => { setNlpQuery(cmd.text); handleNLP(cmd.text); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--iq-border)", fontSize: "11px", color: "var(--iq-text-3)", cursor: "pointer" }}
              >
                <span>{cmd.icon}</span> {cmd.text}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {nlpLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}>
                <Brain className="w-5 h-5" style={{ color: "#00D4FF" }} />
              </motion.div>
              <p style={{ fontSize: "13px", color: "#00D4FF" }}>AI is analysing your financial data…</p>
            </motion.div>
          )}

          {/* Response card */}
          <AnimatePresence>
            {nlpResp && !nlpLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl"
                style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)" }}
              >
                {nlpResp.type === "chart" && (
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#00D4FF", marginBottom: "12px" }}>📊 {nlpResp.title}</p>
                    <div className="flex items-end gap-4 mb-3" style={{ height: "80px" }}>
                      {(nlpResp as any).months.map((m: { m: string; v: number }) => {
                        const max = Math.max(...(nlpResp as any).months.map((x: { v: number }) => x.v));
                        return (
                          <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                            <span style={{ fontSize: "10px", color: "#00D4FF", fontWeight: 600 }}>₹{(m.v / 1000).toFixed(1)}k</span>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(m.v / max) * 55}px` }}
                              transition={{ duration: 0.7, delay: 0.1 }}
                              className="w-full rounded-t-lg self-end"
                              style={{ background: "linear-gradient(180deg, #00D4FF70, #00D4FF25)", minHeight: "4px" }}
                            />
                            <span style={{ fontSize: "11px", color: "var(--iq-text-4)" }}>{m.m}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--iq-text-3)" }}>{(nlpResp as any).insight}</p>
                  </div>
                )}
                {nlpResp.type === "amount" && (
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#00D4FF", marginBottom: "8px" }}>📦 {(nlpResp as any).title}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontSize: "30px", fontWeight: 700, color: "var(--iq-text-1)" }}>{(nlpResp as any).amount}</p>
                        <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>{(nlpResp as any).date} · {(nlpResp as any).category}</p>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--iq-text-3)", maxWidth: "140px", textAlign: "right" }}>{(nlpResp as any).note}</p>
                    </div>
                  </div>
                )}
                {nlpResp.type === "split" && (
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#00D4FF", marginBottom: "8px" }}>👥 Smart Split — ₹{(nlpResp as any).amount.toLocaleString("en-IN")} ÷ {(nlpResp as any).people} people</p>
                    <p style={{ fontSize: "30px", fontWeight: 700, color: "#10B981" }}>₹{(nlpResp as any).each}<span style={{ fontSize: "14px", fontWeight: 400, color: "var(--iq-text-4)", marginLeft: "4px" }}>per person</span></p>
                    <p style={{ fontSize: "12px", color: "var(--iq-text-3)", marginTop: "6px" }}>{(nlpResp as any).suggestion}</p>
                  </div>
                )}
                {nlpResp.type === "category" && (
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#00D4FF", marginBottom: "8px" }}>🏆 Top Spending Category</p>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: "32px" }}>🍽️</span>
                      <div>
                        <p style={{ fontSize: "20px", fontWeight: 700, color: (nlpResp as any).color }}>{(nlpResp as any).name}</p>
                        <p style={{ fontSize: "13px", color: "var(--iq-text-3)" }}>
                          {(nlpResp as any).amount} · {(nlpResp as any).percent} of total · {(nlpResp as any).trend}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {nlpResp.type === "help" && (
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#00D4FF", marginBottom: "8px" }}>🤖 I can help you with…</p>
                    {(nlpResp as any).suggestions.map((s: string, i: number) => (
                      <p key={i} style={{ fontSize: "12px", color: "var(--iq-text-3)", marginTop: "5px" }}>{s}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 8. Architecture Stack ───────────────────────────────── */}
        <div className="rounded-2xl p-5" style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5" style={{ color: "#8B5CF6" }} />
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--iq-text-1)" }}>AI Architecture Stack</h3>
            <span style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>— next-level tech under the hood</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { title: "GPT-4o",              desc: "Insight generation",      icon: "🧠", color: "#10B981" },
              { title: "ML Classifier",       desc: "Category prediction",     icon: "🏷️", color: "#00D4FF" },
              { title: "Pattern Clustering",  desc: "Habit & trend detection", icon: "🔍", color: "#8B5CF6" },
              { title: "Vector Embeddings",   desc: "Semantic search engine",  icon: "🔢", color: "#F59E0B" },
              { title: "Realtime Events",     desc: "Live dashboard sync",     icon: "⚡", color: "#EC4899" },
            ].map((arch) => (
              <motion.div
                key={arch.title}
                whileHover={{ y: -2 }}
                className="p-3 rounded-xl text-center"
                style={{ background: arch.color + "08", border: `1px solid ${arch.color}22` }}
              >
                <span style={{ fontSize: "26px" }}>{arch.icon}</span>
                <p style={{ fontSize: "12px", fontWeight: 600, color: arch.color, marginTop: "6px" }}>{arch.title}</p>
                <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginTop: "2px", lineHeight: 1.4 }}>{arch.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
