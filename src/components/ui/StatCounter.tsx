"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

type StatCounterProps = {
  value: number;
  label: string;
  suffix?: string;
  className?: string;
  durationMs?: number;
};

export function StatCounter({
  value,
  label,
  suffix = "",
  className,
  durationMs = 1400,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, durationMs, reduced]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <p className="font-display text-4xl font-bold text-[var(--neon-cyan)] md:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="font-mono-label mt-2 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}
