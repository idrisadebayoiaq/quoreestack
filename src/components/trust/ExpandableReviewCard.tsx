"use client";

import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/data/content";

function avatarFor(item: Testimonial) {
  if (item.avatar_url) return item.avatar_url;
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.author_name)}&backgroundColor=0c1220&textColor=3d8bff`;
}

export function ExpandableReviewCard({
  item,
  defaultOpen = false,
}: {
  item: Testimonial;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const imageUrl = item.image_url;
  const rating = item.rating ?? 5;
  const shortQuote =
    item.quote.length > 140 && !open
      ? `${item.quote.slice(0, 140).trim()}…`
      : item.quote;

  return (
    <figure
      className={cn(
        "flex h-full flex-col overflow-hidden border border-[var(--border-glow)]/70 bg-[var(--bg-glass)] transition",
        open && "border-[var(--neon-cyan)]/40 shadow-[var(--glow-sm)]",
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-[16/10] max-h-36 overflow-hidden border-b border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex flex-1 flex-col p-6 text-left"
        aria-expanded={open}
      >
        <div className="mb-4 flex items-center gap-1 text-[var(--neon-magenta)]">
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

        <blockquote className="flex-1 text-base leading-7 text-slate-200">
          “{shortQuote}”
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarFor(item)}
            alt=""
            className="size-11 rounded-full border border-[var(--border-glow)] object-cover bg-[#0c1220]"
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
              open && "rotate-180",
            )}
          />
        </figcaption>

        {open ? (
          <p className="font-mono-label mt-4 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Tap to collapse
          </p>
        ) : item.quote.length > 140 ? (
          <p className="font-mono-label mt-4 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">
            Read full review
          </p>
        ) : (
          <p className="font-mono-label mt-4 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Expand details
          </p>
        )}
      </button>
    </figure>
  );
}
