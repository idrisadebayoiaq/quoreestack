import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import {
  SectionCta,
  ServiceCard,
} from "@/components/cards/ContentCards";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { NeonButton } from "@/components/ui/NeonButton";
import { getPublishedServices, getSiteSetting } from "@/lib/data/content";
import { defaultPackages, type EngagementPackage } from "@/lib/packages";
import { siteConfig } from "@/lib/utils";

const workflow = [
  {
    title: "Scope",
    text: "Define outcomes, must-haves, and timeline before commitment.",
  },
  {
    title: "Build",
    text: "Iterate in visible slices — UI, API, and data in sync.",
  },
  {
    title: "Review",
    text: "Test flows, harden security, and polish the experience.",
  },
  {
    title: "Deliver",
    text: "Deploy, document, and support the handoff cleanly.",
  },
];

export const revalidate = 60;

export default async function ServicesPage() {
  const [services, packages] = await Promise.all([
    getPublishedServices(),
    getSiteSetting<EngagementPackage[]>("packages"),
  ]);
  const engagementPackages = packages?.length ? packages : defaultPackages;

  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Services
          </p>
          <h1 className="font-display max-w-3xl text-4xl text-white md:text-6xl">
            Capabilities built for shipping
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Full stack services for teams and founders who need reliable web products,
            Android apps, and backend systems — each with a dedicated detail page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NeonButton href="/start">Start a project</NeonButton>
            <NeonButton href="/projects" variant="secondary">
              See work
            </NeonButton>
            <NeonButton href="/pricing" variant="ghost">
              Pricing
            </NeonButton>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={1} eyebrow="Catalog" title="Service list" />
          {services.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)]">
              Services will appear once published.
            </p>
          )}
        </section>
      </Reveal>

      <Reveal>
        <PackagesGrid
          packages={engagementPackages}
          eyebrow="Engagements"
          title="Pick a starting package"
        />
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={3} eyebrow="Workflow" title="How engagements run" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6"
              >
                <p className="font-mono-label text-[10px] text-[var(--neon-cyan)]">
                  0{index + 1}
                </p>
                <h3 className="font-display mt-4 text-xl text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
          <SectionHeading index={4} eyebrow="Quote" title="Get a Quote" />
          <SectionCta
            href="/start"
            body="Tell me about your product, timeline, and stack preferences — I'll respond with a clear next step."
            button="Build a project brief"
          />
          <div className="mt-6 flex flex-wrap gap-4">
            <NeonButton href="/contact" variant="secondary">
              Contact directly
            </NeonButton>
            <NeonButton href="/faq" variant="ghost">
              Read FAQ
            </NeonButton>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
