"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

const PortraitDepth = dynamic(() => import("@/components/hero/PortraitDepth"), { ssr: false });

const TEXTURE_WIDTH = 1024;

type HeroPortraitProps = {
  src: string;
  alt: string;
};

export function HeroPortrait({ src, alt }: HeroPortraitProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const reduced = usePrefersReducedMotion();
  const [depthEnabled, setDepthEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    setDepthEnabled(true);

    const frame = frameRef.current;
    if (!frame) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let raf = 0;
    const tilt = { x: 0, y: 0 };
    const apply = () => {
      const target = pointer.current.active ? pointer.current : { x: 0, y: 0 };
      tilt.x += (target.x - tilt.x) * 0.08;
      tilt.y += (target.y - tilt.y) * 0.08;
      frame.style.transform = `perspective(1100px) rotateY(${tilt.x * 6}deg) rotateX(${tilt.y * 5}deg)`;
      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${50 + tilt.x * 35}% ${50 - tilt.y * 35}%, rgba(255,248,238,0.16), transparent 55%)`;
      }
      raf = Math.abs(target.x - tilt.x) + Math.abs(target.y - tilt.y) > 0.001 ? requestAnimationFrame(apply) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && !finePointer) return;
      const rect = frame.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pointer.current.x = Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth / 2)));
      pointer.current.y = Math.max(-1, Math.min(1, -(event.clientY - cy) / (window.innerHeight / 2)));
      pointer.current.active = true;
      kick();
    };
    const onLeave = () => {
      pointer.current.active = false;
      kick();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const textureSrc = src.startsWith("/")
    ? `/_next/image?url=${encodeURIComponent(src)}&w=${TEXTURE_WIDTH}&q=85`
    : src;

  return (
    <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-none">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[calc(var(--radius)*2)] bg-[radial-gradient(circle_at_50%_40%,rgba(var(--accent-rgb),0.28),transparent_65%)] blur-2xl"
      />
      <div
        ref={frameRef}
        className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)*1.5)] border border-[var(--line-strong)] bg-[var(--bg-secondary)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 460px, (min-width: 640px) 384px, 352px"
          className="object-cover"
        />
        {depthEnabled ? <PortraitDepth src={textureSrc} pointer={pointer} /> : null}
        <div ref={sheenRef} aria-hidden className="pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent"
        />
      </div>
    </div>
  );
}
