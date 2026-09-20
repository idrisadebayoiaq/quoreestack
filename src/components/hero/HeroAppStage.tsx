"use client";

import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

type FloatCard = {
  src: string;
  label: string;
  kind: "phone" | "laptop";
  className: string;
  delay: string;
};

const floats: FloatCard[] = [
  {
    src: "/images/service-android.png",
    label: "Android",
    kind: "phone",
    className: "left-[8%] top-[14%] w-[140px] md:w-[180px]",
    delay: "0s",
  },
  {
    src: "/images/category-saas.png",
    label: "Dashboard",
    kind: "laptop",
    className: "right-[6%] top-[10%] w-[220px] md:w-[320px]",
    delay: "0.8s",
  },
  {
    src: "/images/category-mobile.png",
    label: "Mobile",
    kind: "phone",
    className: "right-[18%] bottom-[16%] w-[120px] md:w-[160px]",
    delay: "1.4s",
  },
  {
    src: "/images/service-fullstack.png",
    label: "Web app",
    kind: "laptop",
    className: "left-[18%] bottom-[12%] w-[200px] md:w-[280px]",
    delay: "2s",
  },
  {
    src: "/images/project-starlights-mock.png",
    label: "Product",
    kind: "laptop",
    className: "left-[42%] top-[18%] hidden w-[240px] lg:block",
    delay: "1.1s",
  },
];

export function HeroAppStage() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(61,139,255,0.16),transparent_45%)]" />

      {floats.map((item) => (
        <div
          key={item.label}
          className={`absolute ${item.className} ${
            reduced ? "" : "animate-hero-float"
          }`}
          style={reduced ? undefined : { animationDelay: item.delay }}
        >
          {item.kind === "phone" ? (
            <div className="rounded-[1.4rem] border border-white/15 bg-[#0a101c]/85 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-center">
                <span className="h-1 w-10 rounded-full bg-white/20" />
              </div>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1rem]">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                  priority={item.label === "Android"}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-white/15 bg-[#0a101c]/85 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-1.5 px-1">
                <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                <span className="size-1.5 rounded-full bg-[#febc2e]" />
                <span className="size-1.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono-label text-[8px] uppercase tracking-wider text-white/40">
                  {item.label}
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-md">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
