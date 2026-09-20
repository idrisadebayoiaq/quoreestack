"use client";

import Image from "next/image";
import { HeroAppStage } from "@/components/hero/HeroAppStage";
import { HeroWebGL } from "@/components/hero/HeroWebGL";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

type HeroBackgroundProps = {
  videoSrc?: string | null;
  posterSrc?: string;
};

export function HeroBackground({
  posterSrc = "/images/quorestack-hero-poster.jpg",
}: HeroBackgroundProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06080f]">
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-[70%_center] opacity-50"
      />

      {/* Living app interfaces drifting across the hero */}
      <HeroAppStage />

      {!reduced ? (
        <div className="absolute inset-0 z-[2]">
          <HeroWebGL />
        </div>
      ) : null}

      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#06080f] via-[#06080f]/88 to-[#06080f]/35" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/30" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_22%_40%,rgba(var(--accent-rgb),0.14),transparent_42%)]" />
    </div>
  );
}
