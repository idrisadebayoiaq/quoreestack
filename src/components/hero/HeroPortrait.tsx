"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

const PortraitDepth = dynamic(() => import("@/components/hero/PortraitDepth"), { ssr: false });

const TEXTURE_WIDTH = 1024;

const edgeFade =
  "linear-gradient(to top, transparent, #000 12%), linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)";

type HeroPortraitProps = {
  /** Cut-out portrait with a transparent background. */
  src: string;
  alt: string;
};

export function HeroPortrait({ src, alt }: HeroPortraitProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const reduced = usePrefersReducedMotion();
  const [depthEnabled, setDepthEnabled] = useState(false);
  const [depthReady, setDepthReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    setDepthEnabled(true);

    const stage = stageRef.current;
    if (!stage) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = stage.getBoundingClientRect();
      const faceX = rect.left + rect.width * 0.47;
      const faceY = rect.top + rect.height * 0.38;
      pointer.current.x = Math.max(-1, Math.min(1, (event.clientX - faceX) / (rect.width * 0.7)));
      pointer.current.y = Math.max(-1, Math.min(1, -(event.clientY - faceY) / (rect.height * 0.7)));
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const textureSrc = src.startsWith("/")
    ? `/_next/image?url=${encodeURIComponent(src)}&w=${TEXTURE_WIDTH}&q=90`
    : src;

  return (
    <div ref={stageRef} className="relative mx-auto aspect-square w-full max-w-[24rem] sm:max-w-md lg:max-w-none">
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(var(--accent-rgb),0.38),rgba(var(--accent-rgb),0.08)_45%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute bottom-[2%] left-1/2 h-[7%] w-[62%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl"
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 520px, (min-width: 640px) 448px, 384px"
        className={`object-contain object-bottom transition-opacity duration-700 ${depthReady ? "opacity-0" : "opacity-100"}`}
        style={{
          maskImage: edgeFade,
          WebkitMaskImage: edgeFade,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      {depthEnabled ? (
        <PortraitDepth src={textureSrc} pointer={pointer} onReady={() => setDepthReady(true)} />
      ) : null}
    </div>
  );
}
