"use client";

import Image from "next/image";
import { HeroWebGL } from "@/components/hero/HeroWebGL";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

type HeroBackgroundProps = {
  videoSrc?: string | null;
  posterSrc?: string;
};

export function HeroBackground({
  videoSrc = "/videos/quorestack-hero.mp4",
  posterSrc = "/images/quorestack-hero-poster.jpg",
}: HeroBackgroundProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06080f]">
      {/* Poster / still — always visible base layer */}
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-[68%_center]"
      />

      {/* Looping video over the poster */}
      {videoSrc && !reduced ? (
        <video
          className="absolute inset-0 z-[1] h-full w-full object-cover object-[68%_center] opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}

      {/* Soft WebGL accents — transparent so media stays visible */}
      {!reduced ? (
        <div className="absolute inset-0 z-[2]">
          <HeroWebGL />
        </div>
      ) : null}

      {/* Readable vignette — lighter so media still reads */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#06080f]/95 via-[#06080f]/55 to-[#06080f]/25" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/25" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_22%_40%,rgba(var(--accent-rgb),0.18),transparent_42%)]" />
    </div>
  );
}
