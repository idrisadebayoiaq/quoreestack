"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), { ssr: false });

/** Loads Three.js only on wide screens with motion allowed; everyone else keeps the poster. */
export function HeroSceneLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(wide.matches && !calm.matches);
    update();
    wide.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[55%] min-[1600px]:w-[50%]">
      <HeroScene />
    </div>
  );
}
