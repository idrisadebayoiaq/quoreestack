import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { NeonButton } from "@/components/ui/NeonButton";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Industries",
  description: `Who ${siteConfig.author} builds for — local businesses, SaaS teams, logistics, and wellness products.`,
};

export const revalidate = 60;

const industries = [
  {
    slug: "local-business",
    title: "Local businesses",
    summary:
      "Service brands that need a credible web presence, clear booking or inquiry flows, and pages that convert visitors into jobs.",
    services: [
      { href: "/services/full-stack-web", label: "Full-stack web" },
      { href: "/services/mvp-prototype", label: "MVP / prototype" },
    ],
    work: [
      { href: "/projects/ak-plumbing-co", label: "AK Plumbing Co." },
      {
        href: "/projects/s-a-thornton-building-services",
        label: "S. A. Thornton",
      },
      { href: "/projects/starlights-visuals", label: "Starlights Visuals" },
    ],
  },
  {
    slug: "saas-products",
    title: "SaaS & product teams",
    summary:
      "Dashboards, portals, and multi-tenant tools that need solid auth, data models, and interfaces operators can trust.",
    services: [
      { href: "/services/full-stack-web", label: "Full-stack web" },
      { href: "/services/api-backend", label: "API & backend" },
    ],
    work: [
      { href: "/categories/saas-dashboards", label: "SaaS category" },
      { href: "/services/api-backend", label: "Backend capability" },
    ],
  },
  {
    slug: "logistics-mobility",
    title: "Logistics & mobility",
    summary:
      "Android-first products for operations teams — tracking, dispatch, and field workflows that need reliable installs.",
    services: [
      { href: "/services/mobile-android", label: "Android apps" },
      { href: "/services/api-backend", label: "API & backend" },
    ],
    work: [
      { href: "/apps/epic-transport", label: "EPIC TRANSPORT" },
      { href: "/categories/mobile-apps", label: "Mobile category" },
    ],
  },
  {
    slug: "wellness-lifestyle",
    title: "Wellness & lifestyle",
    summary:
      "Calm product experiences across web and mobile — content, booking, and companion apps with a polished feel.",
    services: [
      { href: "/services/full-stack-web", label: "Full-stack web" },
      { href: "/services/mobile-android", label: "Android apps" },
    ],
    work: [
      { href: "/projects/x-relax", label: "Relaxation website" },
      { href: "/apps/x-relax", label: "X-RELAX app" },
    ],
  },
];

export default function IndustriesPage() {
  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Industries
          </p>
          <h1 className="font-display max-w-3xl text-4xl text-white md:text-6xl">
            Built for operators who need software that ships
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Same engineering standards across audiences — mapped to the services and
            work that already prove the fit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NeonButton href="/start">Start a project</NeonButton>
            <NeonButton href="/projects" variant="secondary">
              Browse work
            </NeonButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {industries.map((industry, index) => (
            <Reveal key={industry.slug} delay={index * 0.04}>
              <article className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-7 md:p-8">
                <p className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">
                  0{index + 1}
                </p>
                <h2 className="font-display mt-3 text-2xl text-white md:text-3xl">
                  {industry.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                  {industry.summary}
                </p>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="font-mono-label mb-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {industry.services.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-sm border border-[var(--border-glow)] px-3 py-1.5 text-sm text-white transition hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono-label mb-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Related work
                    </p>
                    <ul className="space-y-2">
                      {industry.work.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="inline-flex items-center gap-2 text-sm text-[var(--neon-cyan)] transition hover:gap-3"
                          >
                            {item.label}
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-8 text-center md:p-10">
          <p className="font-display text-2xl text-white md:text-3xl">
            Don&apos;t see your industry?
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            Share the problem and audience. If it&apos;s a strong fit, I&apos;ll say so
            clearly — and map the right delivery path.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <NeonButton href="/contact">Contact</NeonButton>
            <NeonButton href="/stack" variant="secondary">
              View the stack
            </NeonButton>
          </div>
        </div>
      </section>
    </main>
  );
}
