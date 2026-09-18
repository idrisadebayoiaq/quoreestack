import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Cpu,
  FileArchive,
  Layers3,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { AppCard } from "@/components/apps/AppCard";
import { DownloadButton } from "@/components/apps/DownloadButton";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { NeonButton } from "@/components/ui/NeonButton";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };
type Feature = { title: string; description?: string };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("mobile_apps")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map(({ slug }) => ({ slug }));
}

function parseFeatures(value: unknown): Feature[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") return [{ title: item }];
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const title = record.title ?? record.name ?? record.label;
        if (typeof title === "string") {
          return [
            {
              title,
              description:
                typeof record.description === "string"
                  ? record.description
                  : undefined,
            },
          ];
        }
      }
      return [];
    });
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(
      ([title, description]) => ({
        title,
        description: typeof description === "string" ? description : undefined,
      }),
    );
  }

  return [];
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "Not listed";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: app } = await supabase
    .from("mobile_apps")
    .select("name, tagline, short_description, meta_title, meta_description, icon_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!app) return { title: "App not found" };

  const title = app.meta_title ?? `${app.name} for Android`;
  const description =
    app.meta_description ??
    app.short_description ??
    app.tagline ??
    `Explore and securely download ${app.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: app.icon_url ? [{ url: app.icon_url, alt: `${app.name} icon` }] : [],
    },
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: app, error } = await supabase
    .from("mobile_apps")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error("Unable to load this app.");
  if (!app) notFound();

  const latestVersionRequest = supabase
    .from("app_versions_public")
    .select("id, version, version_code, file_size_bytes, changelog, created_at, is_latest")
    .eq("app_id", app.id)
    .eq("is_latest", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const relatedAppsRequest = app.category_id
    ? supabase
        .from("mobile_apps")
        .select(
          "id, name, slug, tagline, short_description, icon_url, featured, tech_stack, min_android_version",
        )
        .eq("status", "published")
        .eq("category_id", app.category_id)
        .neq("id", app.id)
        .order("sort_order", { ascending: true })
        .limit(3)
    : supabase
        .from("mobile_apps")
        .select(
          "id, name, slug, tagline, short_description, icon_url, featured, tech_stack, min_android_version",
        )
        .eq("status", "published")
        .neq("id", app.id)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .limit(3);

  const [
    { data: latestVersion, error: versionError },
    { data: relatedApps, error: relatedError },
  ] = await Promise.all([latestVersionRequest, relatedAppsRequest]);

  if (versionError || relatedError) {
    throw new Error("Unable to load release details.");
  }

  const features = parseFeatures(app.features);
  const screenshots = app.screenshot_urls ?? [];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border-glow)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(var(--accent-rgb),0.1),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(var(--secondary-rgb),0.08),transparent_24%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <Link
            href="/apps"
            className="font-mono-label mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
          >
            <ArrowLeft className="size-4" /> App directory
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
              {app.icon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={app.icon_url}
                  alt={`${app.name} icon`}
                  className="size-32 rounded-[1.8rem] border border-white/10 object-cover shadow-[var(--glow-sm)]"
                />
              ) : (
                <div className="grid size-32 shrink-0 place-items-center rounded-[1.8rem] border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10">
                  <Smartphone className="size-12 text-[var(--neon-cyan)]" />
                </div>
              )}
              <div>
                <p className="font-mono-label text-xs uppercase tracking-[0.25em] text-[var(--neon-cyan)]">
                  Android application
                </p>
                <h1 className="font-display mt-3 text-4xl text-white md:text-6xl">
                  {app.name}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
                  {app.tagline ?? app.short_description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <DownloadButton
                slug={app.slug}
                version={latestVersion?.version}
                directUrl={app.download_url}
                disabled={!app.download_url && !latestVersion}
              />
              <NeonButton
                href={`/start?app=${encodeURIComponent(app.slug)}&service=mobile-android`}
                variant="secondary"
                className="min-w-56"
              >
                Build one like this
              </NeonButton>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <section className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading index={1} eyebrow="Overview" title="Built for the Mission" />
            <div className="whitespace-pre-wrap text-base leading-8 text-[var(--text-muted)]">
              {app.long_description ?? app.short_description ?? "Product details are coming soon."}
            </div>

            {screenshots.length ? (
              <div className="mt-12">
                <h2 className="font-display mb-6 text-2xl text-white">Interface Preview</h2>
                <div className="flex snap-x gap-5 overflow-x-auto pb-4">
                  {screenshots.map((screenshot, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${screenshot}-${index}`}
                      src={screenshot}
                      alt={`${app.name} screenshot ${index + 1}`}
                      className="h-[34rem] w-auto max-w-[85vw] shrink-0 snap-start rounded-xl border border-[var(--border-glow)] object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="h-fit border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 backdrop-blur-md lg:sticky lg:top-24">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-[var(--neon-cyan)]">
              Latest release
            </p>
            <dl className="mt-6 space-y-5">
              {[
                {
                  icon: Layers3,
                  label: "Version",
                  value: latestVersion?.version
                    ? `${latestVersion.version}${latestVersion.version_code ? ` (${latestVersion.version_code})` : ""}`
                    : "Pending",
                },
                {
                  icon: FileArchive,
                  label: "Package size",
                  value: formatBytes(latestVersion?.file_size_bytes ?? null),
                },
                {
                  icon: CalendarDays,
                  label: "Released",
                  value: latestVersion?.created_at
                    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                        new Date(latestVersion.created_at),
                      )
                    : "Not listed",
                },
                {
                  icon: Cpu,
                  label: "Requires",
                  value: app.min_android_version
                    ? `Android ${app.min_android_version}+`
                    : "Android device",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-[var(--neon-cyan)]" />
                  <div>
                    <dt className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm text-white">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex items-start gap-2 border-t border-[var(--border-glow)] pt-5 text-xs leading-5 text-[var(--text-muted)]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--neon-cyan)]" />
              Authenticated, time-limited delivery from secure storage.
            </div>
          </aside>
        </section>

        {features.length ? (
          <section className="mt-20">
            <SectionHeading index={2} eyebrow="Capabilities" title="Core Features" />
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={`${feature.title}-${index}`}
                  className="hud-corners border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5"
                >
                  <div className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10">
                      <Check className="size-3.5 text-[var(--neon-cyan)]" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-white">{feature.title}</h3>
                      {feature.description ? (
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                          {feature.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-20 grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading index={3} eyebrow="System" title="Technology Stack" />
            <div className="flex flex-wrap gap-3">
              {(app.tech_stack ?? []).length ? (
                app.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono-label border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 px-3 py-2 text-xs uppercase tracking-wider text-[var(--neon-cyan)]"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--text-muted)]">Stack details are private.</p>
              )}
            </div>
          </div>
          <div>
            <SectionHeading index={4} eyebrow="Compatibility" title="Requirements" />
            <ul className="space-y-3 text-sm text-[var(--text-muted)]">
              <li className="flex gap-3">
                <Check className="size-5 text-[var(--neon-cyan)]" />
                Android {app.min_android_version ?? "compatible"} device
              </li>
              <li className="flex gap-3">
                <Check className="size-5 text-[var(--neon-cyan)]" />
                Permission to install apps from your browser
              </li>
              <li className="flex gap-3">
                <Check className="size-5 text-[var(--neon-cyan)]" />
                Stable connection for the timed download link
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading index={5} eyebrow="Release log" title="What's New" />
          <div className="hud-corners border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6">
            <p className="font-mono-label text-xs uppercase tracking-wider text-[var(--neon-cyan)]">
              Version {latestVersion?.version ?? "pending"}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">
              {latestVersion?.changelog ?? "Release notes will appear with the next published build."}
            </p>
          </div>
        </section>

        <section className="mt-20 border border-[var(--border-glow)] bg-[var(--bg-glass)] p-8 text-center md:p-10">
          <p className="font-mono-label text-xs uppercase tracking-[0.25em] text-[var(--neon-cyan)]">
            Need a custom build?
          </p>
          <h2 className="font-display mt-3 text-2xl text-white md:text-3xl">
            Commission an app like {app.name}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            Tell me your goals and timeline. I&apos;ll map scope, stack, and a clear
            delivery plan for your Android product.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <NeonButton
              href={`/start?app=${encodeURIComponent(app.slug)}&service=mobile-android`}
            >
              Start a project
            </NeonButton>
            <NeonButton href="/apps" variant="ghost">
              ← All apps
            </NeonButton>
          </div>
        </section>

        {relatedApps?.length ? (
          <section className="mt-20">
            <SectionHeading index={5} eyebrow="Continue exploring" title="Related Apps" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedApps.map((relatedApp) => (
                <AppCard key={relatedApp.id} app={relatedApp} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
