"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

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
  /** Kept for call-site compatibility; every heading now uses the same restrained reveal. */
  animation?: HeadingAnimation;
  index?: 1 | 2 | 3 | 4 | 5;
  eyebrow?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function animationForIndex(index: 1 | 2 | 3 | 4 | 5): HeadingAnimation {
  return HEADING_ANIMATIONS[index - 1];
}

const headingClass =
  "font-display text-3xl tracking-tight text-[var(--text-strong)] md:text-5xl text-balance";
const eyebrowClass =
  "font-mono-label mb-4 text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]";

export function SectionHeading({
  title,
  eyebrow,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={cn("mb-10", className)}>
        {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
        <Tag className={headingClass}>{title}</Tag>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("mb-10", className)}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
      <Tag className={headingClass}>{title}</Tag>
    </motion.div>
  );
}
