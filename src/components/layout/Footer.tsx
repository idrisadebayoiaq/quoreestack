import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { socialLinks } from "@/lib/socials";
import { getSiteSetting } from "@/lib/data/content";
import type { AvailabilitySetting } from "@/lib/packages";

const footerLinks = [
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/apps", label: "Apps" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/start", label: "Start a project" },
  { href: "/portal", label: "Client portal" },
];

const serviceLinks = [
  { href: "/services/full-stack-web", label: "Web platforms" },
  { href: "/services/mobile-android", label: "Mobile apps" },
  { href: "/services/api-backend", label: "APIs & backends" },
  { href: "/services/mvp-prototype", label: "MVP engineering" },
];

const techItems = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "React Native",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Framer Motion",
];

export async function Footer() {
  const availability = await getSiteSetting<AvailabilitySetting>("availability");
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

  return (
    <footer className="mt-auto border-t border-[var(--border-glow)]/40">
      <MarqueeStrip items={techItems} />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-[var(--neon-cyan)] font-display text-xs font-bold text-[var(--neon-cyan)] shadow-[var(--glow-sm)]">
              QS
            </span>
            <span className="font-display text-xl font-bold text-white">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-5 max-w-sm leading-7 text-[var(--text-muted)]">
            Premium websites, Android apps, and backend systems engineered by{" "}
            {siteConfig.author}.
          </p>
          <div className="mt-6 space-y-3 text-sm text-[var(--text-muted)]">
            <a
              href="mailto:adebayoquoreeb@gmail.com"
              className="flex items-center gap-2 transition hover:text-[var(--neon-cyan)]"
            >
              <Mail className="size-4" /> adebayoquoreeb@gmail.com
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-[var(--neon-cyan)]" />
              Osogbo, Nigeria · Working worldwide
            </p>
          </div>
        </div>

        <div>
          <FooterTitle>Navigate</FooterTitle>
          <div className="space-y-3">
            {footerLinks.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </div>
        </div>

        <div>
          <FooterTitle>Capabilities</FooterTitle>
          <div className="space-y-3">
            {serviceLinks.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </div>
        </div>

        <div>
          <FooterTitle>Social</FooterTitle>
          <div className="space-y-3">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono-label flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
              >
                {social.label}
                <ArrowUpRight className="size-3" />
              </Link>
            ))}
          </div>
          <Link
            href="/start"
            className="font-mono-label mt-7 inline-flex border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/5 px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--neon-green)]"
          >
            ● {availabilityLabel}
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--border-glow)]/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center md:flex-row md:px-6 md:text-left">
          <p className="font-mono-label text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.author}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Designed & engineered with Next.js + Supabase
            </p>
            <Link
              href="/login?next=/admin"
              className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-muted)]/50 transition hover:text-[var(--text-muted)]"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display mb-5 text-sm uppercase tracking-wider text-white">
      {children}
    </p>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className="font-mono-label block text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:translate-x-1 hover:text-[var(--neon-cyan)]"
    >
      {children}
    </Link>
  );
}
