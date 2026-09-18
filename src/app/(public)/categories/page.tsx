import { SectionHeading } from "@/components/animations/SectionHeading";
import {
  CategoryCard,
  SectionCta,
} from "@/components/cards/ContentCards";
import { GlowCard } from "@/components/ui/GlowCard";
import { getPublishedCategories } from "@/lib/data/content";

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await getPublishedCategories();
  const featured = categories.find((c) => c.featured) ?? categories[0];

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading
          index={1}
          eyebrow="Taxonomy"
          title="Explore by Category"
        />
        <p className="max-w-2xl text-lg text-[var(--text-muted)]">
          Browse work and services by domain — from e-commerce to mobile and
          SaaS dashboards.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading index={2} eyebrow="Library" title="All Categories" />
        {categories.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">Categories coming soon.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading index={3} eyebrow="Spotlight" title="Featured Domain" />
        {featured ? (
          <GlowCard href={`/categories/${featured.slug}`} className="md:p-10">
            <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.3em] text-[var(--neon-magenta)]">
              Featured
            </p>
            <h3 className="font-display mb-3 text-3xl text-white">
              {featured.name}
            </h3>
            <p className="max-w-2xl text-[var(--text-muted)]">
              {featured.long_description ?? featured.short_description}
            </p>
          </GlowCard>
        ) : (
          <p className="text-[var(--text-muted)]">No featured category yet.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          index={4}
          eyebrow="Map"
          title="Categories ↔ Services"
        />
        <p className="mb-8 max-w-2xl text-[var(--text-muted)]">
          Each category connects to relevant services and projects. Open a
          category detail page for filtered work and related offerings.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/categories/${category.slug}`}
              data-cursor="hover"
              className="flex items-center justify-between rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] px-4 py-3 backdrop-blur-md transition hover:border-[var(--neon-cyan)]"
            >
              <span className="font-display text-white">{category.name}</span>
              <span className="font-mono-label text-xs text-[var(--neon-cyan)]">
                View →
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={5} eyebrow="Continue" title="Browse Projects" />
        <SectionCta
          body="See how these categories show up in real shipped work."
          href="/projects"
          button="View projects"
        />
      </section>
    </main>
  );
}
