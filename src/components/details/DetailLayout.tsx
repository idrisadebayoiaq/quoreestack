import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/utils";

type HeroFact = {
  label: string;
  value: string;
};

export function DetailHero({
  eyebrow,
  title,
  summary,
  imageUrl,
  imageAlt,
  accent = "cyan",
  facts = [],
  actions,
}: {
  eyebrow: string;
  title: string;
  summary?: string | null;
  imageUrl?: string | null;
  imageAlt?: string;
  accent?: "cyan" | "magenta";
  facts?: HeroFact[];
  actions?: React.ReactNode;
}) {
  const accentColor =
    accent === "magenta" ? "var(--neon-magenta)" : "var(--neon-cyan)";

  return (
    <section className="relative overflow-hidden border-b border-[var(--border-glow)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 75% 35%, color-mix(in srgb, ${accentColor} 20%, transparent), transparent 42%)`,
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <p
            className="font-mono-label mb-4 text-xs uppercase tracking-[0.35em]"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          {summary ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              {summary}
            </p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          {facts.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[var(--border-glow)] bg-[var(--border-glow)] sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-[var(--bg-primary)] p-4">
                  <dt className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div className="hud-corners relative aspect-[4/3] overflow-hidden rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? ""}
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <span
                  aria-hidden
                  className="font-display text-6xl"
                  style={{ color: accentColor }}
                >
                  ◇
                </span>
                <p className="font-mono-label mt-3 text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Case file
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function DetailSection({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16 md:px-6", className)}>
      {eyebrow ? (
        <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display mb-8 text-2xl font-bold text-white md:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ProseText({
  text,
  fallback,
}: {
  text?: string | null;
  fallback: string;
}) {
  const paragraphs = text
    ?.split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs?.length) {
    return <EmptyState title="Details in progress" body={fallback} />;
  }

  return (
    <div className="max-w-3xl space-y-5 text-base leading-8 text-[var(--text-muted)] md:text-lg">
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}

export function TagList({
  items,
  emptyLabel,
}: {
  items?: string[] | null;
  emptyLabel: string;
}) {
  if (!items?.length) {
    return (
      <p className="font-mono-label text-xs uppercase tracking-wider text-[var(--text-muted)]">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="font-mono-label rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--neon-cyan)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="hud-corners rounded-sm border border-dashed border-[var(--border-glow)] bg-[var(--bg-glass)] p-8">
      <p className="font-display text-lg text-white">{title}</p>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
        {body}
      </p>
    </div>
  );
}

export function MediaGallery({
  images,
  title,
}: {
  images?: string[] | null;
  title: string;
}) {
  if (!images?.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={cn(
            "hud-corners relative aspect-[16/10] overflow-hidden rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)]",
            index === 0 && images.length % 2 === 1 && "md:col-span-2",
          )}
        >
          <Image
            src={image}
            alt={`${title} gallery image ${index + 1}`}
            fill
            unoptimized
            sizes={index === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover transition duration-500 hover:scale-[1.02]"
          />
        </div>
      ))}
    </div>
  );
}

export function MetricGrid({
  metrics,
}: {
  metrics: Array<{ label?: string; value?: string }>;
}) {
  if (!metrics.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <GlowCard key={`${metric.label}-${index}`} className="min-h-32">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            {metric.label || "Result"}
          </p>
          <p className="font-display mt-3 text-2xl text-white">
            {metric.value || "Outcome documented"}
          </p>
        </GlowCard>
      ))}
    </div>
  );
}

export function InlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-mono-label text-xs uppercase tracking-wider text-[var(--neon-cyan)] transition hover:text-white"
    >
      {children} →
    </Link>
  );
}
