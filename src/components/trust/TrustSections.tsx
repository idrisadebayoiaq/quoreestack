import type { ClientLogo, Testimonial } from "@/lib/data/content";
import { ExpandableReviewCard } from "@/components/trust/ExpandableReviewCard";
import { Reveal } from "@/components/animations/Reveal";
import { revealVariantForIndex } from "@/lib/motion";
import Link from "next/link";

export function ClientLogoStrip({ logos }: { logos: ClientLogo[] }) {
  if (!logos.length) return null;

  return (
    <section className="border-y border-[var(--border-glow)]/50 bg-[var(--bg-secondary)]/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <p className="font-mono-label mb-8 text-center text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Trusted by teams and founders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
          {logos.map((logo) => {
            const image = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.logo_url}
                alt={logo.name}
                width={140}
                height={48}
                className="h-10 w-auto max-w-[140px] object-contain opacity-80 transition hover:opacity-100"
              />
            );
            return logo.website_url ? (
              <a
                key={logo.id}
                href={logo.website_url}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex"
                title={logo.name}
              >
                {image}
              </a>
            ) : (
              <div key={logo.id} title={logo.name}>
                {image}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsGrid({
  testimonials,
  showCta = true,
}: {
  testimonials: Testimonial[];
  showCta?: boolean;
}) {
  if (!testimonials.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
        Client feedback
      </p>
      <h2 className="font-display mb-10 max-w-2xl text-3xl text-white md:text-4xl">
        What clients say after we ship
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05} variant={revealVariantForIndex(index)}>
            <ExpandableReviewCard item={item} />
          </Reveal>
        ))}
      </div>
      {showCta ? (
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/reviews"
            className="font-mono-label text-xs uppercase tracking-wider text-[var(--neon-cyan)] transition hover:underline"
          >
            Browse all reviews →
          </Link>
          <Link
            href="/reviews#submit"
            className="font-mono-label text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
          >
            Leave a review
          </Link>
        </div>
      ) : null}
    </section>
  );
}
