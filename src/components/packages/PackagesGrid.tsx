import Link from "next/link";
import { Check } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import type { EngagementPackage } from "@/lib/packages";

export function PackagesGrid({
  packages,
  eyebrow = "Engagements",
  title = "Clear ways to work together",
}: {
  packages: EngagementPackage[];
  eyebrow?: string;
  title?: string;
}) {
  if (!packages.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
        {eyebrow}
      </p>
      <h2 className="font-display mb-10 max-w-2xl text-3xl text-white md:text-4xl">
        {title}
      </h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {packages.map((item) => (
          <article
            key={item.slug}
            className={`flex h-full flex-col border p-6 ${
              item.featured
                ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/5"
                : "border-[var(--border-glow)] bg-[var(--bg-glass)]"
            }`}
          >
            {item.featured ? (
              <p className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--neon-cyan)]">
                Most requested
              </p>
            ) : null}
            <h3 className="font-display text-2xl text-white">{item.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{item.summary}</p>
            <p className="mt-6 font-display text-xl text-[var(--neon-cyan)]">{item.price}</p>
            <p className="font-mono-label mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {item.timeline}
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {item.includes.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-[var(--text-muted)]">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--neon-green)]" />
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
      <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Not sure which fits?{" "}
        <Link href="/start" className="text-[var(--neon-cyan)] hover:underline">
          Build a project brief
        </Link>{" "}
        in under two minutes.
      </p>
    </section>
  );
}
