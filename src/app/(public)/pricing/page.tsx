import type { Metadata } from "next";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { NeonButton } from "@/components/ui/NeonButton";
import { getSiteSetting } from "@/lib/data/content";
import { defaultPackages, type EngagementPackage } from "@/lib/packages";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Engagement packages and pricing paths for ${siteConfig.author}.`,
};

export const revalidate = 60;

export default async function PricingPage() {
  const packages =
    (await getSiteSetting<EngagementPackage[]>("packages")) ?? defaultPackages;

  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Pricing
          </p>
          <h1 className="font-display max-w-3xl text-4xl text-white md:text-6xl">
            Clear engagement paths
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Pick a starting package or tell me your scope. Quotes stay tied to outcomes —
            not vague hourly mystery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NeonButton href="/start">Start a project</NeonButton>
            <NeonButton href="/contact" variant="secondary">
              Ask a pricing question
            </NeonButton>
          </div>
        </div>
      </section>

      <Reveal>
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <PackagesGrid packages={packages} />
        </div>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-4xl px-4 pb-24 text-center md:px-6">
          <SectionHeading
            index={2}
            eyebrow="Not sure?"
            title="We'll scope it together"
            className="mb-6 flex flex-col items-center"
          />
          <p className="mb-8 text-[var(--text-muted)]">
            Send a short brief and I&apos;ll recommend the right package — or a custom path.
          </p>
          <NeonButton href="/start">Build your brief</NeonButton>
        </section>
      </Reveal>
    </main>
  );
}
