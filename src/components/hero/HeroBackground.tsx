"use client";

import Image from "next/image";
import { HeroWebGL } from "@/components/hero/HeroWebGL";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

type HeroBackgroundProps = {
  /** Optional looping mp4/webm under /public/videos */
  videoSrc?: string | null;
  posterSrc?: string;
};

export function HeroBackground({
  videoSrc = "/videos/quorestack-hero.mp4",
  posterSrc = "/images/quorestack-hero-poster.jpg",
}: HeroBackgroundProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center]"
      />
      {!reduced ? <HeroWebGL /> : null}
      {videoSrc && !reduced ? (
        <video
          className="absolute inset-0 hidden h-full w-full object-cover opacity-45 mix-blend-screen md:block"
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06080f] via-[#06080f]/90 to-[#06080f]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_40%,rgba(var(--accent-rgb),0.16),transparent_42%)]" />
    </div>
  );
}
