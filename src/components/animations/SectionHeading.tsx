"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

/** Kept for call-site compatibility; all variants now use one soft rise. */
export const HEADING_ANIMATIONS = [
  "glitch-reveal",
  "slide-mask",
  "typewriter",
  "split-chars-rise",
  "neon-flicker",
] as const;

export type HeadingAnimation = (typeof HEADING_ANIMATIONS)[number];

type SectionHeadingProps = {
  title: string;
  animation?: HeadingAnimation;
  /** 1–5 kept for call-site compatibility */
  index?: 1 | 2 | 3 | 4 | 5;
  eyebrow?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function animationForIndex(index: 1 | 2 | 3 | 4 | 5): HeadingAnimation {
  return HEADING_ANIMATIONS[index - 1];
}

export function SectionHeading({
  title,
  index: _index = 1,
  eyebrow,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  void _index;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={cn("mb-8", className)}>
        {eyebrow ? (
          <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
            {eyebrow}
          </p>
        ) : null}
        <Tag className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </Tag>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("mb-8", className)}>
      {eyebrow ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono-label mb-3 text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]"
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tag className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </Tag>
      </motion.div>
    </div>
  );
}
