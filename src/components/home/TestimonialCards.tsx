import type { Testimonial } from "@/lib/data/content";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Generated initials avatars read as placeholders; draw our own instead of showing them. */
function realPhoto(item: Testimonial) {
  const url = item.avatar_url;
  if (!url || url.includes("dicebear.com")) return null;
  return url;
}

export function TestimonialCards({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <div
      className={
        testimonials.length >= 3
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          : "grid gap-6 md:grid-cols-2"
      }
    >
      {testimonials.map((item) => {
        const photo = realPhoto(item);
        return (
          <figure
            key={item.id}
            className="flex h-full min-w-0 flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-secondary)] p-6 sm:p-7"
          >
            <span aria-hidden className="font-display text-5xl leading-none text-[var(--neon-cyan)]">
              “
            </span>
            <blockquote className="mt-2 flex-1 text-lg leading-8 text-[var(--text-body)]">
              {item.quote}
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--line)] pt-5">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="size-11 rounded-full object-cover" />
              ) : (
                <span
                  aria-hidden
                  className="grid size-11 place-items-center rounded-full bg-[var(--bg-primary)] text-sm font-semibold text-[var(--text-strong)]"
                >
                  {initials(item.author_name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-[var(--text-strong)]">{item.author_name}</p>
                <p className="truncate text-sm text-[var(--text-muted)]">
                  {[item.author_title, item.company].filter(Boolean).join(", ")}
                </p>
              </div>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
