"use client";

import { useEffect, useRef, useState } from "react";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/use-motion";

type TrailPoint = { x: number; y: number; id: number };

export function CyberCursor() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useIsFinePointer();
  const enabled = finePointer && !reduced;

  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailId = useRef(0);
  const raf = useRef<number | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const currentRing = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("has-cyber-cursor");

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });

      // Capture id now — reading trailId inside setState can collide when
      // multiple mousemove updaters flush after several increments.
      const id = ++trailId.current;
      const point = { x: e.clientX, y: e.clientY, id };
      setTrail((prev) => [...prev, point].slice(-10));
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        "a, button, [data-cursor='hover'], [role='button']",
      );
      setHovering(Boolean(interactive));
    };

    const tick = () => {
      const lerp = 0.18;
      currentRing.current.x +=
        (target.current.x - currentRing.current.x) * lerp;
      currentRing.current.y +=
        (target.current.y - currentRing.current.y) * lerp;
      setRing({ ...currentRing.current });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("has-cyber-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const scale = hovering ? 1.55 : 1;

  return (
    <>
      {/* Mouse-follow ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(var(--accent-rgb), 0.07), transparent 40%)`,
        }}
      />

      {/* Trail */}
      {trail.map((p, i) => (
        <span
          key={p.id}
          aria-hidden
          className="pointer-events-none fixed z-[99] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neon-cyan)] md:block"
          style={{
            left: p.x,
            top: p.y,
            opacity: (i + 1) / trail.length / 2.5,
          }}
        />
      ))}

      {/* Outer ring */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[100] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--neon-cyan)] md:block"
        style={{
          left: ring.x,
          top: ring.y,
          transform: `translate(-50%, -50%) scale(${scale})`,
          boxShadow: hovering
            ? "0 0 16px rgba(var(--secondary-rgb), 0.45)"
            : "0 0 12px rgba(var(--accent-rgb), 0.3)",
          borderColor: hovering ? "var(--neon-magenta)" : "var(--neon-cyan)",
          transition: "transform 0.15s ease, border-color 0.15s ease",
        }}
      />

      {/* Inner dot */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[100] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neon-cyan)] md:block"
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  );
}
