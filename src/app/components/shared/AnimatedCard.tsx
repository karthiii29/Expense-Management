import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  hoverGlow?: boolean;
  /** Extra inline styles applied only on hover via Framer motion whileHover */
  glowColor?: string;
}

export function AnimatedCard({
  children,
  className = "",
  style,
  delay = 0,
  hoverGlow = true,
  glowColor = "rgba(0,212,255,0.12)",
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={
        hoverGlow
          ? {
              y: -3,
              boxShadow: `0 12px 40px ${glowColor}, 0 2px 8px rgba(0,0,0,0.3)`,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "var(--iq-surface)",
        border: "1px solid var(--iq-border)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
