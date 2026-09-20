"use client";

import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/data/content";
import { usePrefersReducedMotion } from "@/hooks/use-motion";

function avatarFor(item: Testimonial) {
  if (item.avatar_url) return item.avatar_url;
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.author_name)}&backgroundColor=0c1220&textColor=3d8bff`;
}

function ReviewPreview({
  item,
  active,
  onSelect,
}: {
  item: Testimonial;
  active: boolean;
  onSelect: () => void;
}) {
  const rating = item.rating ?? 5;
  const preview =
    item.quote.length > 96 ? `${item.quote.slice(0, 96).trim()}…` : item.quote;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={active}
      className={cn(
        "flex h-full w-[280px] shrink-0 flex-col border bg-[var(--bg-glass)] p-5 text-left transition md:w-[320px]",
        active
          ? "border-[var(--neon-cyan)]/50 shadow-[var(--glow-sm)]"
          : "border-[var(--border-glow)]/70 hover:border-[var(--neon-cyan)]/30",
      )}
    >
      <div className="mb-3 flex items-center gap-1 text-[var(--neon-magenta)]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              index < rating ? "fill-current" : "opacity-25",
            )}
          />
        ))}
      </div>
      <p className="flex-1 text-sm leading-6 text-slate-200">“{preview}”</p>
      <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarFor(item)}
          alt=""
          className="size-10 rounded-full border border-[var(--border-glow)] object-cover bg-[#0c1220]"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {item.author_name}
          </p>
          <p className="truncate text-xs text-[var(--text-muted)]">
            {[item.author_title, item.company].filter(Boolean).join(" · ")}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[var(--neon-cyan)] transition",
            active && "rotate-180",
          )}
        />
      </div>
      <p className="font-mono-label mt-3 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">
        {active ? "Hide details" : "Tap for full review"}
      </p>
    </button>
  );
}

function ReviewDetails({ item }: { item: Testimonial }) {
  const rating = item.rating ?? 5;

  return (
    <div className="mt-6 overflow-hidden border border-[var(--neon-cyan)]/35 bg-[var(--bg-secondary)]/80 shadow-[var(--glow-sm)]">
      <div className="grid md:grid-cols-[minmax(0,0.9fr)_1.1fr]">
        {item.image_url ? (
          <div className="relative min-h-[200px] border-b border-white/5 md:border-b-0 md:border-r">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt=""
              className="h-full max-h-[320px] w-full object-cover md:absolute md:inset-0 md:max-h-none"
            />
          </div>
        ) : null}
        <div className="p-6 md:p-8">
          <div className="mb-4 flex items-center gap-1 text-[var(--neon-magenta)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={cn(
                  "size-4",
                  index < rating ? "fill-current" : "opacity-25",
                )}
              />
            ))}
          </div>
          <blockquote className="text-lg leading-8 text-slate-100 md:text-xl">
            “{item.quote}”
          </blockquote>
          <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarFor(item)}
              alt=""
              className="size-14 rounded-full border border-[var(--border-glow)] object-cover bg-[#0c1220]"
            />
            <div>
              <p className="font-display text-lg text-white">
                {item.author_name}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {[item.author_title, item.company].filter(Boolean).join(" · ") ||
                  "Client"}
              </p>
              {item.source ? (
                <p className="font-mono-label mt-1 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">
                  Via {item.source}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewsMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = testimonials.find((item) => item.id === activeId) ?? null;
  const row =
    !reduced && testimonials.length > 2
      ? [...testimonials, ...testimonials]
      : testimonials;

  function toggle(id: string) {
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <div>
      <div
        className={cn(
          "relative -mx-4 md:-mx-6",
          reduced ? "" : "overflow-hidden",
        )}
      >
        {!reduced && testimonials.length > 2 ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--bg-primary)] to-transparent md:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--bg-primary)] to-transparent md:w-16" />
          </>
        ) : null}

        <div
          className={cn(
            "flex gap-4 py-2",
            reduced || testimonials.length <= 2
              ? "flex-wrap justify-start px-4 md:px-6"
              : cn(
                  "w-max animate-reviews-marquee px-4 md:px-6",
                  activeId && "[animation-play-state:paused]",
                  "hover:[animation-play-state:paused]",
                ),
          )}
        >
          {row.map((item, index) => (
            <ReviewPreview
              key={`${item.id}-${index}`}
              item={item}
              active={activeId === item.id}
              onSelect={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>

      {active ? <ReviewDetails item={active} /> : null}
    </div>
  );
}
