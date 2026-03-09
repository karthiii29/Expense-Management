import { motion, AnimatePresence } from "motion/react";
import { RefreshCw } from "lucide-react";

interface LiveIndicatorProps {
  secondsAgo: number;
  isRefreshing: boolean;
}

function formatAgo(s: number) {
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

export function LiveIndicator({ secondsAgo, isRefreshing }: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {isRefreshing ? (
          <motion.div
            key="refreshing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "var(--iq-accent-s)", border: "1px solid var(--iq-accent-b)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-3 h-3" style={{ color: "var(--iq-accent)" }} />
            </motion.div>
            <span style={{ fontSize: "11px", color: "var(--iq-accent)", fontWeight: 600 }}>
              Syncing…
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full"
                style={{ background: "#10B981", opacity: 0.6 }}
                animate={{ scale: [1, 1.8, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "#10B981" }}
              />
            </span>
            <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 600 }}>
              Live · {formatAgo(secondsAgo)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Full-width skeleton shimmer bar */
export function SkeletonBar({
  width = "100%",
  height = 16,
  rounded = 8,
}: {
  width?: string | number;
  height?: number;
  rounded?: number;
}) {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius: rounded,
        background: "var(--iq-surface-h)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

/** Card-sized skeleton */
export function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)", height }}
    >
      <div className="flex items-start justify-between">
        <SkeletonBar width={40} height={40} rounded={12} />
        <SkeletonBar width={60} height={22} rounded={11} />
      </div>
      <SkeletonBar width="70%" height={28} rounded={6} />
      <SkeletonBar width="50%" height={14} rounded={6} />
    </div>
  );
}

/** Chart skeleton */
export function SkeletonChart({ height = 160 }: { height?: number }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--iq-surface)", border: "1px solid var(--iq-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <SkeletonBar width={120} height={16} rounded={6} />
          <SkeletonBar width={80} height={12} rounded={6} />
        </div>
        <SkeletonBar width={60} height={24} rounded={12} />
      </div>
      <SkeletonBar width="100%" height={height} rounded={8} />
    </div>
  );
}
