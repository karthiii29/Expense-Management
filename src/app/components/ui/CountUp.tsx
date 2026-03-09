import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/** Smoothly animates from prev value → new value on every `end` change */
export function CountUp({
  end,
  duration = 900,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const [current, setCurrent] = useState(end);
  const prevRef = useRef(end);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    if (from === end) return;
    prevRef.current = end;
    startRef.current = null;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (end - from) * eased;
      setCurrent(val);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(end);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration]);

  const formatted =
    decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString("en-IN");

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
