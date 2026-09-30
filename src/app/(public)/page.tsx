import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { HeroPortrait } from "@/components/hero/HeroPortrait";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { ServiceCard } from "@/components/cards/ContentCards";
import { ClientLogoStrip } from "@/components/trust/TrustSections";
import { NeonButton } from "@/components/ui/NeonButton";
import { StatCounter } from "@/components/ui/StatCounter";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { HomeAboutSection } from "@/components/about/HomeAboutSection";
import { WorkShowcase } from "@/components/home/WorkShowcase";
import { TestimonialCards } from "@/components/home/TestimonialCards";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { EngagementTerms, type EngagementTerm } from "@/components/home/EngagementTerms";
import { Ticker } from "@/components/home/Ticker";
import {
  getContactChannels,
  getFeaturedProjects,
  getFeaturedServices,
  getFeaturedTestimonials,
  getPublishedClientLogos,
  getSiteSetting,
  getTrackRecord,
} from "@/lib/data/content";
import { processSteps } from "@/lib/process";
import { sortByProof } from "@/lib/projects";
import {
  defaultPackages,
  type AvailabilitySetting,
  type EngagementPackage,
} from "@/lib/packages";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({ path: "/" });

export const revalidate = 60;

const faqs = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Websites for service businesses and studios, Android apps, APIs, and dashboards — from a first version to a production system that needs clean architecture and reliable delivery.",
  },
  {
    question: "How does your process work?",
    answer:
      "We start with discovery, agree on scope and timeline, then build in milestones you can review. You see progress early instead of waiting until the end.",
  },
  {
    question: "How do we start?",
    answer:
      "Build a short brief with Start a project, or book a 20-minute call. I reply with next steps and whether we are a strong fit.",
  },
];

const tickerItems = [
  "Web platforms",
  "Android apps",
  "APIs & backends",
  "Admin dashboards",
  "Supabase & Postgres",
  "Launch & support",
];

function AccentLastWord({ text }: { text: string }) {
  const trimmed = text.trim();
  const split = trimmed.lastIndexOf(" ");
  if (split < 0) return <span className="text-[var(--neon-cyan)]">{trimmed}</span>;
  return (
    <>
      {trimmed.slice(0, split)}{" "}
      <span className="text-[var(--neon-cyan)]">{trimmed.slice(split + 1)}</span>
    </>
  );
}

function Readout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={`font-mono-label absolute z-10 flex items-center gap-1.5 text-[11px] uppercase text-[var(--steel)] ${className ?? ""}`}
    >
      <span className="text-base leading-none text-[var(--neon-cyan)]">+</span>
      {children}
    </span>
  );
}

export default async function HomePage() {
  const [
    hero,
    featuredProjects,
    featuredServices,
    testimonials,
    logos,
    packages,
    availability,
    engagementTerms,
    trackRecord,
    channels,
  ] = await Promise.all([
    getSiteSetting<{
      headline?: string;
      subheadline?: string;
      background_image?: string;
    }>("hero"),
    getFeaturedProjects(6),
    getFeaturedServices(3),
    getFeaturedTestimonials(3),
    getPublishedClientLogos(8),
    getSiteSetting<EngagementPackage[]>("packages"),
    getSiteSetting<AvailabilitySetting>("availability"),
    getSiteSetting<EngagementTerm[]>("engagement_terms"),
    getTrackRecord(),
    getContactChannels(),
  ]);

  const engagementPackages = packages?.length ? packages : defaultPackages;
  const showcase = sortByProof(featuredProjects).slice(0, 3);
  return (
    <main>
      <section id="hero" className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(var(--accent-rgb),0.12),transparent_50%)]"
        />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 md:pb-20 md:pt-24 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-2xl">
            <p className="animate-hero-rise font-mono-label tag-dash text-xs uppercase tracking-[0.18em] text-[var(--neon-cyan)]">
              {siteConfig.name} · {siteConfig.author}
            </p>
            <h1 className="animate-hero-rise-delay font-display mt-6 text-[3.25rem] text-[var(--text-strong)] sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
              <AccentLastWord text={hero?.headline ?? "Systems that ship."} />
            </h1>
            <p className="animate-hero-rise-delay-2 mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)] md:mt-7 md:text-[1.15rem]">
              {hero?.subheadline ??
                "Websites, Android apps, and backends engineered end to end — from first brief to production."}
            </p>
            <div className="animate-hero-rise-delay-2 mt-10 flex flex-wrap items-center gap-3">
              <NeonButton href="/start">Start a project</NeonButton>
              {channels.bookingUrl ? (
                <NeonButton href={channels.bookingUrl} variant="secondary">
                  Book a 20-min call
                </NeonButton>
              ) : null}
            </div>
            <div className="animate-hero-rise-delay-2 mt-10">
              <AvailabilityBadge availability={availability} />
            </div>
          </div>
          <div className="relative mx-auto -mb-16 w-full max-w-[22rem] self-end sm:max-w-[26rem] md:-mb-20 lg:mx-0 lg:max-w-none">
            <div
              aria-hidden
              className="absolute left-1/2 top-0 aspect-square w-[98%] -translate-x-1/2 rounded-full border border-dashed border-[var(--line)]"
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-[9%] aspect-square w-[80%] -translate-x-1/2 rounded-full border border-[rgba(var(--accent-rgb),0.3)] bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.3),rgba(var(--accent-rgb),0.07)_55%,transparent_72%)]"
            />
            <HeroPortrait
              src="/images/quoreeb-cutout.png"
              alt={`${siteConfig.author}, ${siteConfig.title}`}
            />
            <Readout className="left-0 top-[6%]">Stack · Next.js</Readout>
            <Readout className="right-0 top-[30%] hidden sm:flex">DB · PostgreSQL</Readout>
          </div>
        </div>
      </section>

      <Ticker items={tickerItems} />

      <ClientLogoStrip logos={logos} />

      <section id="work" className="mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Recent projects, start to launch"
            className="mb-0 max-w-2xl"
          />
          <NeonButton href="/projects" variant="ghost">
            All projects <ArrowRight className="size-4" />
          </NeonButton>
        </div>
        {showcase.length ? (
          <WorkShowcase projects={showcase} />
        ) : (
          <p className="text-[var(--text-muted)]">Case studies will appear here once published.</p>
        )}
      </section>

      {testimonials.length ? (
        <section id="reviews" className="border-y border-[var(--line)] bg-[var(--bg-secondary)]/50">
          <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Client feedback"
                title="What clients say after launch"
                className="mb-0 max-w-2xl"
              />
              <NeonButton href="/reviews" variant="ghost">
                All reviews <ArrowRight className="size-4" />
              </NeonButton>
            </div>
            <TestimonialCards testimonials={testimonials} />
          </div>
        </section>
      ) : null}

      <HomeAboutSection />

      <section id="services" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Services"
            title="What I can build for you"
            className="mb-0 max-w-2xl"
          />
          <NeonButton href="/services" variant="ghost">
            All services <ArrowRight className="size-4" />
          </NeonButton>
        </div>
        {featuredServices.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredServices.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.06} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </section>

      <PackagesGrid packages={engagementPackages} title="Transparent starting prices" />

      {engagementTerms?.length ? (
        <section id="engagements" className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
          <SectionHeading
            eyebrow="How engagements work"
            title="Payment, revisions, and ownership — agreed up front"
          />
          <EngagementTerms terms={engagementTerms} />
        </section>
      ) : null}

      <section id="process" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
        <SectionHeading eyebrow="How I work" title="A clear path from brief to launch" />
        <ProcessTimeline steps={processSteps} />
      </section>

      <section id="stats" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-2 gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          {[
            { value: trackRecord.years, label: "Years building", suffix: "+" },
            { value: trackRecord.projects, label: "Projects shipped" },
            { value: trackRecord.apps, label: "Android apps released" },
            { value: trackRecord.technologies, label: "Technologies in use" },
          ].map((stat) => (
            <div key={stat.label} className="corner-tick bg-[var(--bg-primary)] px-6 py-9 md:px-8 md:py-10">
              <StatCounter value={stat.value} label={stat.label} suffix={stat.suffix} />
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-4 py-24 md:px-6">
        <SectionHeading eyebrow="FAQ" title="Quick answers" />
        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-xl !font-semibold text-[var(--text-strong)] md:text-2xl">
                {faq.question}
                <span
                  aria-hidden
                  className="text-3xl font-light text-[var(--neon-cyan)] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-3xl pt-4 leading-8 text-[var(--text-muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-[var(--text-muted)]">
          More in the{" "}
          <Link
            href="/faq"
            className="font-semibold text-[var(--text-strong)] underline decoration-[var(--line-strong)] underline-offset-4 hover:decoration-[var(--neon-cyan)]"
          >
            full FAQ
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
