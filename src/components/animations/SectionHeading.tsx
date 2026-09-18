"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
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
  animation?: HeadingAnimation;
  /** 1–5 maps to the five animation variants when animation is omitted */
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
  animation,
  index = 1,
  eyebrow,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const variant = animation ?? animationForIndex(index);

  const chars = useMemo(() => title.split(""), [title]);

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
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-mono-label mb-3 text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]"
        >
          {eyebrow}
        </motion.p>
      ) : null}

      {variant === "glitch-reveal" && (
        <Tag
          className={cn(
            "font-display relative text-3xl font-bold tracking-tight text-white md:text-5xl",
            inView && "animate-glitch",
          )}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.35 }}
            className="relative z-10"
          >
            {title}
          </motion.span>
          {inView ? (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-0.5 text-[var(--neon-magenta)] opacity-60 mix-blend-screen"
              >
                {title}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 translate-x-0.5 text-[var(--neon-cyan)] opacity-60 mix-blend-screen"
              >
                {title}
              </span>
            </>
          ) : null}
        </Tag>
      )}

      {variant === "slide-mask" && (
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tag className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              {title}
            </Tag>
          </motion.div>
        </div>
      )}

      {variant === "typewriter" && (
        <Tag className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          {inView
            ? chars.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.035, duration: 0.01 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))
            : null}
          <motion.span
            aria-hidden
            animate={inView ? { opacity: [1, 0, 1] } : {}}
            transition={{ repeat: 4, duration: 0.5 }}
            className="ml-0.5 inline-block w-[0.08em] bg-[var(--neon-cyan)] align-middle"
            style={{ height: "0.85em" }}
          />
        </Tag>
      )}

      {variant === "split-chars-rise" && (
        <Tag className="font-display flex flex-wrap text-3xl font-bold tracking-tight text-white md:text-5xl">
          {chars.map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              initial={{ y: 28, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{
                delay: i * 0.028,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </Tag>
      )}

      {variant === "neon-flicker" && (
        <Tag
          className={cn(
            "font-display text-3xl font-bold tracking-tight text-white md:text-5xl",
            inView && "animate-neon-flicker",
          )}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.span>
        </Tag>
      )}
    </div>
  );
}
