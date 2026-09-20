import type { Metadata } from "next";
import { NeonButton } from "@/components/ui/NeonButton";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects and uses information for the website, contact forms, and app downloads.`,
};

const updated = "September 20, 2026";

const sections = [
  {
    title: "Who we are",
    body: `${siteConfig.name} is operated by ${siteConfig.author} (“I”, “me”, “we”). This policy explains how personal information is handled when you use ${siteConfig.url}, submit a contact or project brief, download published Android apps, or use the client portal.`,
  },
  {
    title: "Information collected",
    body: "Contact and brief forms may collect your name, email, phone (optional), company, project details, budget range, and any files you attach. App downloads may log request metadata such as timestamp, app slug/version, and approximate network information needed to serve a short-lived download link. If you create an account for the client portal, authentication data is stored via our auth provider.",
  },
  {
    title: "How information is used",
    body: "We use submitted information to respond to inquiries, quote and deliver projects, improve the site, prevent abuse of downloads, and operate the client messaging portal. Lead notifications may be sent to private channels I control (for example Telegram or email). We do not sell your personal information.",
  },
  {
    title: "Processors and hosting",
    body: "The site is hosted with modern cloud providers (including Vercel for the web app). Content, forms, auth, and file storage are powered by Supabase. Download links for APKs are time-limited signed URLs. These processors only receive what is needed to provide their service.",
  },
  {
    title: "Cookies and analytics",
    body: "Essential cookies may be used for authentication sessions. We avoid unnecessary tracking. If analytics tools are added later, they will be disclosed here and kept as privacy-respecting as practical.",
  },
  {
    title: "Retention",
    body: "Contact submissions and project messages are retained as long as needed for client work, support, and legitimate business records. You may request deletion of personal data that is no longer required for an active engagement or legal obligation.",
  },
  {
    title: "Your choices",
    body: "You can contact me to access, correct, or delete personal information associated with your inquiries or account, subject to legitimate retention needs (for example active contracts or abuse prevention).",
  },
  {
    title: "Contact",
    body: `Questions about privacy: adebayoquoreeb@gmail.com — or use the contact form on ${siteConfig.name}.`,
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
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
        <NeonButton href="/contact" variant="secondary">
          Contact about privacy
        </NeonButton>
      </section>
    </main>
  );
}
