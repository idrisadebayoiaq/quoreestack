"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0.35, y: "-100%" }}
        animate={{ opacity: 0, y: "120%" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 top-0 z-50 h-24 bg-gradient-to-b from-[var(--neon-cyan)]/20 to-transparent"
      />
      {children}
    </motion.div>
  );
}
