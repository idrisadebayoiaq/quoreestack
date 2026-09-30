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

/** Server HTML always contains the final value; the count-up is a client-only enhancement. */
export function StatCounter({
  value,
  label,
  suffix = "",
  className,
  durationMs = 1200,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  // Only count up when the stat starts below the fold, so nobody sees the number drop.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || value <= 0) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      setArmed(true);
      setDisplay(0);
    }
  }, [reduced, value]);

  useEffect(() => {
    if (!armed) return;
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
      setDisplay(Math.max(1, Math.round(value * eased)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, inView, value, durationMs, reduced]);

  return (
    <div ref={ref} className={cn("text-left", className)}>
      <p className="font-display text-5xl leading-none text-[var(--text-strong)] md:text-6xl">
        <span aria-hidden>{display}</span>
        <span className="sr-only">{value}</span>
        {suffix ? <sup className="ml-0.5 text-[0.5em] text-[var(--neon-cyan)]">{suffix}</sup> : null}
      </p>
      <p className="font-mono-label mt-3 text-xs uppercase text-[var(--steel,var(--text-muted))]">
        {label}
      </p>
    </div>
  );
}
