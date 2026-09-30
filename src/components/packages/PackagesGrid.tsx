import Link from "next/link";
import { Check } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";
import type { EngagementPackage } from "@/lib/packages";

export function PackagesGrid({
  packages,
  eyebrow = "Pricing",
  title = "Clear ways to work together",
  bare = false,
}: {
  packages: EngagementPackage[];
  eyebrow?: string;
  title?: string;
  /** Render only the cards, for pages that supply their own heading. */
  bare?: boolean;
}) {
  if (!packages.length) return null;

  const grid = (
    <div className="grid gap-6 lg:grid-cols-3">
      {packages.map((item) => (
        <article
          key={item.slug}
          className={cn(
            "corner-tick hover-bar flex h-full flex-col overflow-hidden rounded-[var(--radius)] border p-7",
            item.featured
              ? "border-[rgba(var(--accent-rgb),0.55)] bg-[radial-gradient(circle_at_85%_0%,rgba(var(--accent-rgb),0.16),transparent_55%),var(--bg-glass)]"
              : "border-[var(--line)] bg-[var(--bg-glass)]",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl text-[var(--text-strong)]">{item.name}</h3>
            {item.featured ? (
              <span className="font-mono-label bg-[var(--neon-cyan)] px-2.5 py-1 text-[10px] uppercase text-[var(--on-accent)]">
                Most requested
              </span>
            ) : null}
          </div>
          <p className="mt-3 leading-7 text-[var(--text-muted)]">{item.summary}</p>
          <p className="font-display mt-7 text-3xl text-[var(--text-strong)]">{item.price}</p>
          <p className="font-mono-label mt-2 text-xs uppercase text-[var(--steel,var(--text-muted))]">{item.timeline}</p>
          <ul className="mt-7 flex-1 space-y-3 border-t border-[var(--line)] pt-6">
            {item.includes.map((line) => (
              <li key={line} className="flex gap-2.5 text-[15px] text-[var(--text-body)]">
                <Check className="mt-1 size-4 shrink-0 text-[var(--neon-cyan)]" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <NeonButton
              href={`/start?package=${encodeURIComponent(item.slug)}`}
              variant={item.featured ? "primary" : "secondary"}
              className="w-full"
            >
              Choose {item.name}
            </NeonButton>
          </div>
        </article>
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <p className="font-mono-label tag-dash mb-5 text-xs uppercase tracking-[0.18em] text-[var(--neon-cyan)]">
        {eyebrow}
      </p>
      <h2 className="font-display mb-12 max-w-2xl text-4xl text-[var(--text-strong)] sm:text-5xl md:text-[3.5rem]">
        {title}
      </h2>
      {grid}
      <p className="mt-8 text-[var(--text-muted)]">
        Not sure which fits?{" "}
        <Link href="/start" className="font-semibold text-[var(--text-strong)] underline decoration-[var(--line-strong)] underline-offset-4 hover:decoration-[var(--neon-cyan)]">
          Build a project brief
        </Link>{" "}
        in under two minutes.
      </p>
    </section>
  );
}
