import type { Metadata } from "next";
import { NeonButton } from "@/components/ui/NeonButton";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms for using ${siteConfig.name} — portfolio site, contact forms, and published app downloads.`,
};

const updated = "September 20, 2026";

const sections = [
  {
    title: "Agreement",
    body: `By using ${siteConfig.name} (${siteConfig.url}), submitting forms, downloading published apps, or accessing the client portal, you agree to these Terms of Use. If you do not agree, do not use the site or downloads.`,
  },
  {
    title: "What this site provides",
    body: "The site presents portfolio work, services, engagement information, and optionally Android app releases. Content is provided for informational and commercial inquiry purposes. Project outcomes described on case studies reflect past work and do not guarantee identical results for future engagements.",
  },
  {
    title: "Project engagements",
    body: "Hiring for custom work is governed by a separate proposal, statement of work, or written agreement covering scope, timeline, fees, and ownership. Submitting a brief or contact form does not create a binding project contract until terms are accepted in writing.",
  },
  {
    title: "App downloads",
    body: "Published APKs or Expo builds are provided as-is for evaluation and personal installation. You are responsible for enabling installation from trusted sources on your device and for how you use the software. Downloads may be rate-limited or revoked to prevent abuse. Commercial redistribution of app binaries is not permitted without written permission.",
  },
  {
    title: "Acceptable use",
    body: "Do not attempt to disrupt the site, scrape private data, abuse download endpoints, upload malware via forms, or use the contact channels for spam or illegal activity. I may block access that threatens service integrity.",
  },
  {
    title: "Intellectual property",
    body: `Site design, branding, copy, and original visuals belong to ${siteConfig.author} / ${siteConfig.name} unless otherwise noted. Client project assets remain subject to the agreements under which they were created. Do not reuse protected materials without permission.`,
  },
  {
    title: "Disclaimer",
    body: "The site and published apps are provided without warranties of uninterrupted availability or fitness for a particular purpose beyond what a signed project agreement states. To the fullest extent permitted by law, liability for use of the public site and free downloads is limited.",
  },
  {
    title: "Changes",
    body: "These terms may be updated periodically. The “Last updated” date at the top will change when revisions are published. Continued use after updates constitutes acceptance of the revised terms.",
  },
  {
    title: "Contact",
    body: "Questions: adebayoquoreeb@gmail.com or the contact form on this site.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Legal
          </p>
          <h1 className="font-display text-4xl text-white md:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Last updated {updated}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-10 px-4 py-16 md:px-6 md:py-20">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-2xl text-white">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
              {section.body}
            </p>
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <NeonButton href="/privacy" variant="secondary">
            Privacy Policy
          </NeonButton>
          <NeonButton href="/contact" variant="ghost">
            Contact
          </NeonButton>
        </div>
      </section>
    </main>
  );
}
