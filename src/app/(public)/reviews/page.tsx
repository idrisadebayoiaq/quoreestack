import type { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { ExpandableReviewCard } from "@/components/trust/ExpandableReviewCard";
import { ReviewForm } from "@/components/trust/ReviewForm";
import { NeonButton } from "@/components/ui/NeonButton";
import { getFeaturedTestimonials } from "@/lib/data/content";
import { createStaticClient } from "@/lib/supabase/static";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews",
  description: `Client reviews for ${siteConfig.author} and QuoreStack — and a place to leave your own.`,
};

export const revalidate = 60;

export default async function ReviewsPage() {
  const supabase = createStaticClient();
  const [{ data: published }, featured] = await Promise.all([
    supabase
      .from("testimonials")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
    getFeaturedTestimonials(6),
  ]);

  const reviews = published?.length ? published : featured;

  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Reviews
          </p>
          <h1 className="font-display max-w-3xl text-4xl text-white md:text-6xl">
            Feedback from people I&apos;ve built with
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Expand any card for the full review. If we shipped together, you can submit
            your own — I approve before it goes live.
          </p>
          <div className="mt-8">
            <NeonButton href="#submit">Leave a review</NeonButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={1} eyebrow="Published" title="Client reviews" />
        {reviews.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                <ExpandableReviewCard item={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">Reviews will appear here once published.</p>
        )}
      </section>

      <section id="submit" className="scroll-mt-24 border-t border-[var(--border-glow)]">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
          <SectionHeading index={2} eyebrow="Buyers" title="Add your review" />
          <p className="mb-8 text-[var(--text-muted)]">
            Share what we built and how delivery felt. Submissions stay private until approved.
          </p>
          <ReviewForm />
        </div>
      </section>
    </main>
  );
}
