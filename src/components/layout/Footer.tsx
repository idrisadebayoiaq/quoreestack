import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { getContactChannels, getSiteSetting } from "@/lib/data/content";
import type { AvailabilitySetting } from "@/lib/packages";
import { NeonButton } from "@/components/ui/NeonButton";

const workLinks = [
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/apps", label: "Apps" },
  { href: "/pricing", label: "Pricing" },
  { href: "/industries", label: "Industries" },
  { href: "/reviews", label: "Reviews" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/stack", label: "Stack" },
  { href: "/faq", label: "FAQ" },
  { href: "/start", label: "Start a project" },
  { href: "/portal", label: "Client portal" },
];

const stack = ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "React Native", "Node.js"];

export async function Footer() {
  const [availability, channels] = await Promise.all([
    getSiteSetting<AvailabilitySetting>("availability"),
    getContactChannels(),
  ]);
  const status = availability?.status ?? "open";
  const availabilityLabel =
    availability?.label ??
    (status === "closed"
      ? "Currently fully booked"
      : status === "waitlist"
        ? "Waitlist open"
        : status === "limited"
          ? "Limited openings"
          : "Available for projects");
  const open = status === "open" || status === "limited";

  return (
    <footer className="surface-dark mt-auto">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-20 md:px-6">
        <div className="grid gap-10 border-b border-[var(--line)] pb-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="font-display max-w-xl text-4xl leading-tight text-[var(--text-strong)] md:text-5xl">
              Have a project in mind? Let&apos;s scope it together.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span
                aria-hidden
                className={`size-2 rounded-full ${open ? "bg-[var(--neon-green)]" : "bg-[var(--text-muted)]"}`}
              />
              {availabilityLabel}
              {availability?.note ? ` · ${availability.note}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <NeonButton href="/start">Start a project</NeonButton>
            {channels.bookingUrl ? (
              <NeonButton href={channels.bookingUrl} variant="secondary">
                Book a 20-min call
              </NeonButton>
            ) : null}
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
          <div>
            <Link href="/" className="font-display text-2xl text-[var(--text-strong)]">
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-sm leading-7 text-[var(--text-muted)]">
              Websites, Android apps, and backends by {siteConfig.author}. Based in
              Osogbo, Nigeria — working with clients in Nigeria, the UK, and beyond.
            </p>
            <a
              href={`mailto:${channels.email}`}
              className="mt-5 inline-block text-[var(--text-strong)] underline decoration-[var(--line-strong)] underline-offset-4 transition hover:decoration-[var(--neon-cyan)]"
            >
              {channels.email}
            </a>
          </div>

          <FooterColumn title="Work" links={workLinks} />
          <FooterColumn title="Studio" links={companyLinks} />

          <div>
            <FooterTitle>Elsewhere</FooterTitle>
            <ul className="space-y-3">
              {channels.whatsapp ? (
                <li>
                  <FooterExternal href={channels.whatsapp}>WhatsApp</FooterExternal>
                </li>
              ) : null}
              {channels.socials.map((social) => (
                <li key={social.key}>
                  <FooterExternal href={social.href}>{social.label}</FooterExternal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.author}
          </p>
          <p className="font-mono-label font-mono-keep text-xs">{stack.join(" · ")}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-[var(--text-strong)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--text-strong)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <FooterTitle>{title}</FooterTitle>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterExternal({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
    >
      {children}
      <ArrowUpRight className="size-3.5 opacity-60" />
    </a>
  );
}
