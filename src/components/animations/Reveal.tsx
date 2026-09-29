"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import type { RevealVariant } from "@/lib/motion";

export type { RevealVariant };

const calm = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/** Variant names are kept for call-site compatibility; motion is deliberately uniform. */
const variants: Record<
  RevealVariant,
  { initial: Record<string, string | number>; animate: Record<string, string | number> }
> = {
  "fade-up": calm,
  "fade-down": calm,
  "fade-left": calm,
  "fade-right": calm,
  scale: calm,
  blur: calm,
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });
  const reduced = usePrefersReducedMotion();
  const motionVariant = variants[variant];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={motionVariant.initial}
      animate={inView ? motionVariant.animate : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
