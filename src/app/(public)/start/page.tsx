import type { Metadata } from "next";
import { Suspense } from "react";
import { BriefBuilder } from "@/components/contact/BriefBuilder";
import { defaultPackages, type EngagementPackage } from "@/lib/packages";
import { getSiteSetting } from "@/lib/data/content";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Project brief",
  description: `Build a short project brief for ${siteConfig.author} before sending your inquiry.`,
};

export const revalidate = 60;

export default async function StartPage() {
  const packages =
    (await getSiteSetting<EngagementPackage[]>("packages")) ?? defaultPackages;

  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Project brief
          </p>
          <h1 className="font-display text-4xl text-white md:text-5xl">
            Tell me enough to quote clearly
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">
            Three quick steps. Then I&apos;ll open the contact form with your brief
            already filled in.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <Suspense fallback={<p className="text-[var(--text-muted)]">Loading brief builder…</p>}>
          <BriefBuilder packages={packages} />
        </Suspense>
      </section>
    </main>
  );
}
