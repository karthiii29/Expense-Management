import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Brush, ReferenceLine, CartesianGrid,
} from "recharts";
import { motion } from "motion/react";
import { useRealTime } from "../../context/RealTimeContext";

interface SpendingPoint { day: string; amount: number; [key: string]: any; }

interface TimelineChartProps {
  data?: SpendingPoint[];
}

/* ── Glass Tooltip ───────────────────────────────────────────────────── */
const GlassTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="px-3 py-2.5 rounded-xl"
      style={{
        background: "rgba(15,17,21,0.92)",
        border: "1px solid var(--iq-accent-b)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px var(--iq-accent-s)",
        backdropFilter: "blur(20px)",
        minWidth: "130px",
      }}
    >
      <p style={{ fontSize: "10px", color: "var(--iq-text-4)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: "var(--iq-accent)", boxShadow: "0 0 6px var(--iq-accent)" }} />
        <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--iq-text-1)" }}>
          ₹{Number(value).toLocaleString("en-IN")}
        </span>
      </div>
      <p style={{ fontSize: "10px", color: "var(--iq-text-4)", marginTop: "2px" }}>
        Daily spend
      </p>
    </motion.div>
  );
};

/* ── Custom dot: highlight the latest point with a glow ring ────────── */
const SmartDot = (props: any) => {
  const { cx, cy, index, payload, dataLength } = props;
  const isLatest = index === (dataLength ?? 0) - 1;
  const isPeak = payload?.amount >= 15000;
  if (isLatest) {
    return (
      <g key={`tl-dot-${index}`}>
        <circle cx={cx} cy={cy} r={12} fill="var(--iq-accent)" fillOpacity={0.12} />
        <circle cx={cx} cy={cy} r={7}  fill="var(--iq-accent)" fillOpacity={0.3} />
        <circle cx={cx} cy={cy} r={3.5} fill="var(--iq-accent)" />
        <circle cx={cx} cy={cy} r={1.5} fill="#fff" />
      </g>
    );
  }
  if (isPeak) {
    return (
      <g key={`tl-dot-${index}`}>
        <circle cx={cx} cy={cy} r={5}   fill="#F59E0B" fillOpacity={0.25} />
        <circle cx={cx} cy={cy} r={2.5} fill="#F59E0B" />
      </g>
    );
  }
  return <g key={`tl-dot-${index}`} />;
};

/* ── Custom Brush traveller ──────────────────────────────────────────── */
const BrushTraveller = (props: any) => {
  const { x, y, width, height } = props;
  return (
    <g>
      <rect
        x={x} y={y} width={width} height={height}
        rx={4} fill="var(--iq-accent)" fillOpacity={0.3}
        stroke="var(--iq-accent)" strokeWidth={1}
      />
      {[height / 2 - 4, height / 2, height / 2 + 4].map((ly, i) => (
        <line key={i} x1={x + 3} y1={y + ly} x2={x + width - 3} y2={y + ly}
          stroke="var(--iq-accent)" strokeWidth={1} strokeOpacity={0.6} />
      ))}
    </g>
  );
};

export function TimelineChart({ data = [] }: TimelineChartProps) {
  const { pulseKey } = useRealTime();
  const [refLineX, setRefLineX] = useState<string | null>(null);

  const avg = data.length
    ? data.reduce((s: number, d: SpendingPoint) => s + d.amount, 0) / data.length
    : 0;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[220px] gap-2">
        <p style={{ fontSize: "14px", color: "var(--iq-text-3)" }}>No spending data yet</p>
        <p style={{ fontSize: "12px", color: "var(--iq-text-4)" }}>Add expenses to see your spending timeline</p>
      </div>
    );
  }

  return (
    <div>
      {/* Legend / instructions */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg" style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)" }}>
          <span style={{ fontSize: "10px", color: "var(--iq-accent)", fontWeight: 600 }}>
            ↔ Drag bottom slider to zoom into date range
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5" style={{ background: "rgba(245,158,11,0.7)", borderRadius: 1 }} />
          <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>Peak spend</span>
        </div>
        {avg > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-0" style={{ borderTop: "2px dashed rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: "10px", color: "var(--iq-text-4)" }}>
              Daily avg ₹{avg >= 1000 ? `${Math.round(avg / 1000)}k` : Math.round(avg)}
            </span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          key={`tl-${pulseKey}`}
          data={data}
          margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          onMouseMove={(e) => { if (e.activeLabel) setRefLineX(e.activeLabel as string); }}
          onMouseLeave={() => setRefLineX(null)}
        >
          <defs>
            <linearGradient id="tlGradFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--iq-accent)" stopOpacity={0.55} />
              <stop offset="40%"  stopColor="var(--iq-accent)" stopOpacity={0.2}  />
              <stop offset="100%" stopColor="var(--iq-accent)" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="tlStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="var(--iq-accent-d)" stopOpacity={0.7} />
              <stop offset="100%" stopColor="var(--iq-accent)"   stopOpacity={1}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal vertical={false} />
          <ReferenceLine y={avg} stroke="rgba(255,255,255,0.2)" strokeDasharray="5 3" strokeWidth={1} />
          {refLineX && (
            <ReferenceLine x={refLineX} stroke="var(--iq-accent)" strokeOpacity={0.4} strokeWidth={1} />
          )}
          <XAxis
            dataKey="day"
            tick={{ fill: "var(--iq-text-4)" as string, fontSize: 10 }}
            axisLine={false} tickLine={false} interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--iq-text-4)" as string, fontSize: 10 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
            width={38}
          />
          <Tooltip content={<GlassTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="url(#tlStroke)"
            strokeWidth={2.5}
            fill="url(#tlGradFill)"
            dot={(props: any) => <SmartDot {...props} dataLength={data.length} />}
            activeDot={{ r: 6, fill: "var(--iq-accent)", stroke: "var(--iq-bg)", strokeWidth: 2.5 }}
            name="Spending"
          />
          <Brush
            dataKey="day"
            height={28}
            stroke="var(--iq-border-s)"
            fill="var(--iq-surface)"
            travellerWidth={10}
            traveller={<BrushTraveller />}
            startIndex={0}
            style={{ marginTop: 8 }}
          >
            <AreaChart data={data}>
              <Area type="monotone" dataKey="amount" stroke="var(--iq-accent)" strokeWidth={1} fill="var(--iq-accent-s)" dot={false} />
            </AreaChart>
          </Brush>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
