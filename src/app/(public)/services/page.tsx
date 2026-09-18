import { SectionHeading } from "@/components/animations/SectionHeading";
import {
  SectionCta,
  ServiceCard,
} from "@/components/cards/ContentCards";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { getPublishedServices, getSiteSetting } from "@/lib/data/content";
import { defaultPackages, type EngagementPackage } from "@/lib/packages";

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
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={1} eyebrow="Offerings" title="What I Build" />
        <p className="max-w-2xl text-lg text-[var(--text-muted)]">
          Full stack services for teams and founders who need reliable web
          products, Android apps, and backend systems.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <SectionHeading index={2} eyebrow="Catalog" title="Service list" />
        {services.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">Services will appear once published.</p>
        )}
      </section>

      <PackagesGrid
        packages={engagementPackages}
        eyebrow="Engagements"
        title="Pick a starting package"
      />

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={4} eyebrow="Workflow" title="How engagements run" />
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
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={5} eyebrow="Quote" title="Get a Quote" />
        <SectionCta
          href="/start"
          body="Tell me about your product, timeline, and stack preferences — I'll respond with a clear next step."
          button="Build a project brief"
        />
      </section>
    </main>
  );
}
