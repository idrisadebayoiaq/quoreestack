import { HeroBackground } from "@/components/hero/HeroBackground";
import { Reveal, revealVariantForIndex } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import {
  ProjectCard,
  ServiceCard,
} from "@/components/cards/ContentCards";
import {
  ClientLogoStrip,
  TestimonialsGrid,
} from "@/components/trust/TrustSections";
import { NeonButton } from "@/components/ui/NeonButton";
import { StatCounter } from "@/components/ui/StatCounter";
import {
  getContentCounts,
  getFeaturedProjects,
  getFeaturedServices,
  getFeaturedTestimonials,
  getPublishedClientLogos,
  getSiteSetting,
} from "@/lib/data/content";
import { yearsOfExperience } from "@/lib/experience";
import { processSteps } from "@/lib/process";
import { defaultPackages, type AvailabilitySetting, type EngagementPackage } from "@/lib/packages";
import { siteConfig } from "@/lib/utils";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

const faqs = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Web platforms, Android apps, APIs, dashboards, and full-stack products — from MVP to production systems that need clean architecture and reliable delivery.",
  },
  {
    question: "How does your process work?",
    answer:
      "We start with discovery, agree on scope and timeline, then build in milestones you can review. You see progress early instead of waiting until the end.",
  },
  {
    question: "How do we start?",
    answer:
      "Use Start a Project to build a short brief, then send it through contact. I’ll reply with next steps and whether we’re a strong fit.",
  },
];

export default async function HomePage() {
  const [
    hero,
    stats,
    featuredProjects,
    featuredServices,
    testimonials,
    logos,
    packages,
    availability,
    counts,
  ] = await Promise.all([
    getSiteSetting<{
      headline?: string;
      subheadline?: string;
      background_image?: string;
      background_video?: string;
    }>("hero"),
    getSiteSetting<{
      years?: number;
      projects?: number;
      apps?: number;
      technologies?: number;
    }>("stats"),
    getFeaturedProjects(3),
    getFeaturedServices(3),
    getFeaturedTestimonials(6),
    getPublishedClientLogos(8),
    getSiteSetting<EngagementPackage[]>("packages"),
    getSiteSetting<AvailabilitySetting>("availability"),
    getContentCounts(),
  ]);

  const engagementPackages = packages?.length ? packages : defaultPackages;
  const years = yearsOfExperience();
  const projectsCount = counts.projects || 1;
  const appsCount = counts.apps || 1;
  const techCount = stats?.technologies ?? 12;
  const posterSrc =
    hero?.background_image || "/images/quorestack-hero-poster.jpg";
  const videoSrc =
    hero?.background_video || "/videos/quorestack-hero.mp4";

  return (
    <main>
      <section
        id="hero"
        className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-[var(--border-glow)]"
      >
        <HeroBackground videoSrc={videoSrc} posterSrc={posterSrc} />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 md:px-6">
          <div className="max-w-2xl">
            <p className="animate-hero-rise font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
              {siteConfig.name}
            </p>
            <h1 className="animate-hero-rise-delay mt-5 font-display text-2xl font-semibold tracking-tight text-[var(--neon-cyan)] md:text-4xl">
              {hero?.headline ?? "Systems that ship."}
            </h1>
            <p className="animate-hero-rise-delay-2 mt-5 max-w-xl text-lg leading-8 text-slate-300 md:text-xl">
              {hero?.subheadline ??
                "Websites, Android apps, and backends engineered end to end — from first brief to production."}
            </p>
            <div className="animate-hero-rise-delay-2 mt-8">
              <AvailabilityBadge availability={availability} />
            </div>
            <div className="animate-hero-rise-delay-2 mt-8 flex flex-wrap items-center gap-4">
              <NeonButton href="/start">Start a Project</NeonButton>
              <NeonButton href="/projects" variant="secondary">
                View selected work
              </NeonButton>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
      <section
        id="featured-projects"
        className="mx-auto max-w-6xl px-4 py-24 md:px-6"
      >
        <SectionHeading
          index={2}
          eyebrow="Selected work"
          title="Projects that prove the craft"
        />
        {featuredProjects.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.06} variant={revealVariantForIndex(index)}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">
            Featured projects will appear here once published.
          </p>
        )}
        <div className="mt-10 text-center">
          <NeonButton href="/projects" variant="secondary">
            All projects
          </NeonButton>
        </div>
      </section>
      </Reveal>

      <Reveal variant="fade-left">
        <ClientLogoStrip logos={logos} />
      </Reveal>
      <Reveal delay={0.05} variant="scale">
        <TestimonialsGrid testimonials={testimonials} />
      </Reveal>

      <Reveal variant="fade-up">
      <section id="stats" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={3} eyebrow="Track record" title="By the numbers" />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <StatCounter
            value={years}
            label="Years building"
            suffix="+"
          />
          <StatCounter
            value={projectsCount}
            label="Projects shipped"
            suffix="+"
          />
          <StatCounter
            value={appsCount}
            label="Apps released"
            suffix="+"
          />
          <StatCounter
            value={techCount}
            label="Technologies"
            suffix="+"
          />
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section
        id="featured-services"
        className="mx-auto max-w-6xl px-4 py-24 md:px-6"
      >
        <SectionHeading index={4} eyebrow="Services" title="How I can help" />
        {featuredServices.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredServices.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.06} variant={revealVariantForIndex(index + 1)}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">
            Featured services will appear here once published.
          </p>
        )}
        <div className="mt-10 text-center">
          <NeonButton href="/services" variant="secondary">
            All services
          </NeonButton>
        </div>
      </section>
      </Reveal>

      <Reveal>
        <PackagesGrid packages={engagementPackages} />
      </Reveal>

      <section id="process" className="border-y border-[var(--border-glow)] bg-[var(--bg-glass)]">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <SectionHeading index={5} eyebrow="How I work" title="A clear path to launch" />
          <p className="mb-12 max-w-2xl text-lg text-[var(--text-muted)]">
            From first brief to shipped product — so you always know what comes next.
          </p>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal key={step.slug} delay={i * 0.06}>
                <li>
                  <Link
                    href={`/process/${step.slug}`}
                    data-cursor="hover"
                    className="group relative block overflow-hidden border border-[var(--border-glow)]/70 bg-black/20 transition hover:-translate-y-1 hover:border-[var(--neon-cyan)]/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={step.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 18vw, (min-width: 768px) 45vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/45 to-transparent" />
                      <span className="font-mono-label absolute left-4 top-4 text-xs text-[var(--neon-cyan)]">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                        {step.short}
                      </p>
                      <span className="font-mono-label mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">
                        View details
                        <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Reveal>
      <section
        id="cta"
        className="mx-auto max-w-4xl px-4 py-24 text-center md:px-6"
      >
        <SectionHeading
          index={1}
          eyebrow="Next step"
          title="Ready to build?"
          className="mb-6 flex flex-col items-center"
        />
        <p className="mb-10 text-lg text-[var(--text-muted)]">
          Share your goals and timeline. I&apos;ll reply with clear next steps —
          not a generic sales pitch.
        </p>
        <NeonButton href="/start">Start a Project</NeonButton>
      </section>
      </Reveal>

      <Reveal>
      <section id="faq" className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
        <SectionHeading index={2} eyebrow="FAQ" title="Quick answers" />
        <div className="mt-4 divide-y divide-[var(--border-glow)] border-y border-[var(--border-glow)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-white">
                {faq.question}
                <span className="font-mono-label text-[var(--neon-cyan)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-7 text-[var(--text-muted)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <NeonButton href="/faq" variant="ghost">
            Full FAQ
          </NeonButton>
        </div>
      </section>
      </Reveal>
    </main>
  );
}
