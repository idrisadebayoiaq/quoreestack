"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function ScreenshotGallery({
  appName,
  screenshots,
}: {
  appName: string;
  screenshots: string[];
}) {
  const [active, setActive] = useState<number | null>(null);

  if (!screenshots.length) return null;

  return (
    <>
      <section className="mt-8">
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 [scrollbar-width:thin]">
          {screenshots.map((screenshot, index) => (
            <button
              key={`${screenshot}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className="group relative shrink-0 snap-start overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#111827] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:border-[var(--neon-cyan)]/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot}
                alt={`${appName} screenshot ${index + 1}`}
                className="h-[22rem] w-[11.5rem] object-cover sm:h-[26rem] sm:w-[13.5rem]"
              />
              <span className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-white/10" />
            </button>
          ))}
        </div>
      </section>

      {active !== null ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${appName} screenshot`}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close screenshot"
          >
            <X className="size-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshots[active]}
            alt={`${appName} screenshot ${active + 1}`}
            className="max-h-[90vh] max-w-[min(92vw,28rem)] rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
