import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock3, Mail, MapPin, MessageCircle, Radio } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { NeonButton } from "@/components/ui/NeonButton";
import { getPublishedServices, getSiteSetting } from "@/lib/data/content";
import type { AvailabilitySetting } from "@/lib/packages";
import { socialLinks } from "@/lib/socials";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a web, mobile, or backend project with ${siteConfig.author}.`,
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    service?: string;
    project?: string;
    app?: string;
    subject?: string;
    budget?: string;
  }>;
};

function whatsappHref(raw?: string) {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}`;
}

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const [services, contact, availability] = await Promise.all([
    getPublishedServices(),
    getSiteSetting<{
      email?: string;
      whatsapp?: string;
      booking_url?: string;
      response_note?: string;
    }>("contact"),
    getSiteSetting<AvailabilitySetting>("availability"),
  ]);

  const serviceOptions = services.map((service) => ({
    name: service.name,
    slug: service.slug,
  }));

  const defaultSubject =
    params.subject?.trim() ||
    (params.project
      ? `Project like ${params.project.replace(/-/g, " ")}`
      : params.app
        ? `App like ${params.app.replace(/-/g, " ")}`
        : undefined);

  const email = contact?.email || "adebayoquoreeb@gmail.com";
  const whatsapp = whatsappHref(contact?.whatsapp);
  const bookingUrl = contact?.booking_url?.trim() || null;
  const responseNote = contact?.response_note || "Usually within 24–48 hours";
  const statusLabel =
    availability?.label ??
    (availability?.status === "closed"
      ? "Currently fully booked"
      : availability?.status === "waitlist"
        ? "Waitlist open"
        : availability?.status === "limited"
          ? "Limited openings"
          : "Available for selected projects");

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border-glow)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(var(--accent-rgb),0.1),transparent_34%),radial-gradient(circle_at_12%_80%,rgba(var(--secondary-rgb),0.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-5 text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
            Start a project
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Tell me what you want to build
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Share your goals, timeline, and current challenge. I&apos;ll reply with
            practical next steps—not a generic sales pitch.
          </p>
          {(whatsapp || bookingUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {whatsapp ? (
                <NeonButton href={whatsapp} variant="secondary">
                  <MessageCircle className="size-4" />
                  WhatsApp
                </NeonButton>
              ) : null}
              {bookingUrl ? (
                <NeonButton href={bookingUrl} variant="ghost">
                  <CalendarDays className="size-4" />
                  Book a call
                </NeonButton>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <Reveal>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <SectionHeading index={1} eyebrow="Reach out" title="Contact details" />
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
                { icon: MapPin, label: "Location", value: "Osogbo, Nigeria · Remote worldwide" },
                { icon: Clock3, label: "Response", value: responseNote },
                { icon: Radio, label: "Status", value: statusLabel },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex gap-4 border-b border-white/5 py-4"
                >
                  <Icon className="mt-1 size-5 shrink-0 text-[var(--neon-cyan)]" />
                  <div>
                    <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="mt-1 block text-white hover:text-[var(--neon-cyan)]">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-white">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(whatsapp || bookingUrl) && (
              <div className="mt-8 space-y-3">
                <p className="font-display text-lg text-white">Prefer a faster channel?</p>
                <div className="flex flex-col gap-3">
                  {whatsapp ? (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-label inline-flex items-center gap-2 border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/5 px-4 py-3 text-xs uppercase tracking-wider text-[var(--neon-green)] transition hover:bg-[var(--neon-green)]/10"
                    >
                      <MessageCircle className="size-4" />
                      Chat on WhatsApp
                    </a>
                  ) : null}
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-label inline-flex items-center gap-2 border border-[var(--border-glow)] px-4 py-3 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                    >
                      <CalendarDays className="size-4" />
                      Book a discovery call
                    </a>
                  ) : null}
                </div>
              </div>
            )}

            <div className="mt-10">
              <p className="font-display text-lg text-white">Follow the build</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono-label border border-[var(--border-glow)] px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <ContactForm
            services={serviceOptions}
            defaultServiceSlug={params.service}
            defaultSubject={defaultSubject}
            defaultBudget={params.budget}
          />
        </section>
      </Reveal>
    </main>
  );
}
