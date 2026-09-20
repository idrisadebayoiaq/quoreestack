"use client";

import { ExpandableReviewCard } from "@/components/trust/ExpandableReviewCard";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import type { Testimonial } from "@/lib/data/content";

export function ReviewsMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const reduced = usePrefersReducedMotion();
  const row = [...testimonials, ...testimonials];

  if (reduced) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <ExpandableReviewCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative -mx-4 overflow-hidden md:-mx-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--bg-primary)] to-transparent md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--bg-primary)] to-transparent md:w-20" />
      <div className="group/marquee flex w-max gap-5 py-2 animate-reviews-marquee hover:[animation-play-state:paused]">
        {row.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="w-[300px] shrink-0 md:w-[340px]"
          >
            <ExpandableReviewCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
