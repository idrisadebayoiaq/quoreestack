import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, ShieldCheck, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { AppsCatalog } from "@/components/apps/AppsCatalog";
import { NeonButton } from "@/components/ui/NeonButton";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

const faqs = [
  {
    question: "Are these APKs safe to install?",
    answer:
      "Each release is distributed directly by QuoreStack through a short-lived, signed download link. Android may still ask you to approve installation from your browser.",
  },
  {
    question: "Do I need an account to download?",
    answer:
      "No. Anyone can browse published apps and download the latest APK. Secure links expire after 15 minutes so files stay protected in storage.",
  },
  {
    question: "How do updates work?",
    answer:
      "Open an app page to see its latest version and changelog. Download the newer APK and install it over your existing copy to retain local app data.",
  },
];

export default async function AppsPage() {
  const supabase = await createClient();
  const { data: apps, error } = await supabase
    .from("mobile_apps")
    .select(
      "id, name, slug, tagline, short_description, icon_url, featured, tech_stack, min_android_version",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error("Unable to load the apps catalog.");

  const featuredApp = apps.find((app) => app.featured) ?? apps[0];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border-glow)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(var(--accent-rgb),0.12),transparent_32%),radial-gradient(circle_at_15%_70%,rgba(var(--secondary-rgb),0.08),transparent_26%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div>
            <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
              QuoreStack
            </p>
            <p className="font-mono-label mb-5 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
              Mobile systems // verified releases
            </p>
            <h1 className="font-display max-w-3xl text-4xl leading-tight text-white md:text-6xl">
              Purpose-built apps,
              <span className="block text-[var(--neon-cyan)]">ready to deploy.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              Browse focused Android tools engineered by QuoreStack. Every release
              includes transparent requirements, version notes, and a free secure
              download — no account required.
            </p>
            <a
              href="#catalog"
              className="font-mono-label mt-8 inline-flex items-center gap-2 rounded-sm bg-[var(--neon-cyan)] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--bg-primary)] shadow-[var(--glow-md)] transition hover:brightness-110"
            >
              Browse releases <ArrowRight className="size-4" />
            </a>
          </div>

          {featuredApp ? (
            <Link
              href={`/apps/${featuredApp.slug}`}
              className="hud-corners group relative border border-[var(--neon-cyan)]/35 bg-black/30 p-7 backdrop-blur-xl transition hover:border-[var(--neon-cyan)]"
            >
              <div className="absolute right-4 top-4 size-2 animate-pulse rounded-full bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]" />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-[var(--neon-magenta)]">
                Featured deployment
              </p>
              <div className="mt-7 flex items-center gap-5">
                {featuredApp.icon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredApp.icon_url}
                    alt=""
                    className="size-24 rounded-[1.4rem] border border-white/10 object-cover"
                  />
                ) : (
                  <div className="grid size-24 place-items-center rounded-[1.4rem] border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10">
                    <Smartphone className="size-10 text-[var(--neon-cyan)]" />
                  </div>
                )}
                <div>
                  <h2 className="font-display text-3xl text-white">{featuredApp.name}</h2>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {featuredApp.tagline ?? featuredApp.short_description}
                  </p>
                </div>
              </div>
              <span className="font-mono-label mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--neon-cyan)]">
                Inspect app <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ) : (
            <div className="hud-corners grid min-h-64 place-items-center border border-dashed border-[var(--border-glow)] text-[var(--text-muted)]">
              New releases are being prepared.
            </div>
          )}
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 md:px-6">
        <SectionHeading index={1} eyebrow="App directory" title="Explore the Catalog" />
        <AppsCatalog apps={apps} />
      </section>

      <section className="border-y border-[var(--border-glow)] bg-[var(--bg-glass)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={2} eyebrow="Trust protocol" title="Install with Confidence" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Protected delivery",
                text: "Get a time-limited release link directly from secure storage — no signup needed.",
              },
              {
                icon: Download,
                title: "Transparent releases",
                text: "Review the version, file size, Android requirement, and changelog before download.",
              },
              {
                icon: CheckCircle2,
                title: "Simple installation",
                text: "Allow installs from your browser when prompted, open the APK, then confirm.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="hud-corners border border-[var(--border-glow)] bg-black/15 p-6">
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-[var(--neon-cyan)]" />
                  <span className="font-mono-label text-[10px] text-[var(--text-muted)]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-xl text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-8 text-center md:p-10">
          <p className="font-display text-2xl text-white md:text-3xl">
            Need a custom Android app?
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            These releases show how I ship. Tell me what you want built and I&apos;ll
            map scope, timeline, and delivery.
          </p>
          <div className="mt-8">
            <NeonButton href="/start?service=mobile-android">
              Start a project
            </NeonButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <SectionHeading index={3} eyebrow="Field notes" title="Frequently Asked Questions" />
        <div className="divide-y divide-[var(--border-glow)] border-y border-[var(--border-glow)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-white">
                {faq.question}
                <span className="font-mono-label text-[var(--neon-cyan)] transition group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-7 text-[var(--text-muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
