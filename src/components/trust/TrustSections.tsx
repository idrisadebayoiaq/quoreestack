import type { ClientLogo, Testimonial } from "@/lib/data/content";

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

export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
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
        {testimonials.map((item) => (
          <figure
            key={item.id}
            className="flex h-full flex-col border border-[var(--border-glow)]/70 bg-[var(--bg-glass)] p-6"
          >
            <blockquote className="flex-1 text-base leading-7 text-slate-200">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
              {item.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.avatar_url}
                  alt=""
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <span className="grid size-10 place-items-center rounded-full border border-[var(--border-glow)] font-mono-label text-xs text-[var(--neon-cyan)]">
                  {item.author_name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-white">{item.author_name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {[item.author_title, item.company].filter(Boolean).join(" · ")}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
