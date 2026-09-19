import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Info,
  Share2,
  Smartphone,
} from "lucide-react";
import { AppCard } from "@/components/apps/AppCard";
import { DownloadButton } from "@/components/apps/DownloadButton";
import { ExpandableAbout } from "@/components/apps/ExpandableAbout";
import { ScreenshotGallery } from "@/components/apps/ScreenshotGallery";
import { NeonButton } from "@/components/ui/NeonButton";
import { createStaticClient } from "@/lib/supabase/static";
import { siteConfig } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

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
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

async function resolvePublishedApp(slug: string) {
  const supabase = createStaticClient();
  const exact = await supabase
    .from("mobile_apps")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (exact.error) {
    console.error("App lookup failed", exact.error);
    return { supabase, app: null as null, lookupError: true };
  }
  if (exact.data) return { supabase, app: exact.data, lookupError: false };

  // Short/legacy URLs like /apps/x → /apps/x-relax when uniquely matched
  const { data: matches } = await supabase
    .from("mobile_apps")
    .select("slug")
    .eq("status", "published")
    .or(`slug.eq.${slug},slug.ilike.${slug}-%`)
    .limit(5);

  if (matches?.length === 1 && matches[0].slug !== slug) {
    redirect(`/apps/${matches[0].slug}`);
  }

  return { supabase, app: null as null, lookupError: false };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
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
  const { supabase, app, lookupError } = await resolvePublishedApp(slug);

  if (lookupError) {
    console.error("Unable to load app for slug", slug);
    notFound();
  }
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

  const categoryRequest = app.category_id
    ? supabase
        .from("categories")
        .select("name")
        .eq("id", app.category_id)
        .eq("status", "published")
        .maybeSingle()
    : Promise.resolve({ data: null, error: null });

  const [
    { data: latestVersion, error: versionError },
    { data: relatedApps, error: relatedError },
    { data: category },
  ] = await Promise.all([latestVersionRequest, relatedAppsRequest, categoryRequest]);

  if (versionError) console.error("App version lookup failed", versionError);
  if (relatedError) console.error("Related apps lookup failed", relatedError);

  const features = parseFeatures(app.features);
  const screenshots = app.screenshot_urls ?? [];
  const categoryName = category?.name ?? "Apps";
  const aboutText =
    app.long_description ??
    app.short_description ??
    app.tagline ??
    "Product details are coming soon.";
  const updatedLabel = latestVersion?.created_at
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(latestVersion.created_at),
      )
    : "—";

  return (
    <main className="pb-28 md:pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-6 md:pt-10">
        <Link
          href="/apps"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-white"
        >
          <ArrowLeft className="size-4" /> Apps
        </Link>

        {/* Store header */}
        <section className="mt-6 flex gap-4 sm:gap-5">
          {app.icon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.icon_url}
              alt={`${app.name} icon`}
              className="size-20 shrink-0 rounded-[1.35rem] border border-white/10 object-cover sm:size-28 sm:rounded-[1.75rem]"
            />
          ) : (
            <div className="grid size-20 shrink-0 place-items-center rounded-[1.35rem] bg-[var(--neon-cyan)]/10 sm:size-28 sm:rounded-[1.75rem]">
              <Smartphone className="size-10 text-[var(--neon-cyan)]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl leading-tight text-white sm:text-4xl">
              {app.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-[var(--neon-cyan)] sm:text-base">
              {siteConfig.name}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
              {categoryName}
              {app.min_android_version ? ` · Android ${app.min_android_version}+` : ""}
            </p>
            {app.tagline ? (
              <p className="mt-3 hidden text-sm text-[var(--text-muted)] sm:block">
                {app.tagline}
              </p>
            ) : null}
          </div>
        </section>

        {/* Stats row like Play Store */}
        <section className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/8 bg-white/[0.03] py-4">
          <div className="px-3 text-center">
            <p className="text-sm font-semibold text-white">Free</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Price
            </p>
          </div>
          <div className="px-3 text-center">
            <p className="text-sm font-semibold text-white">
              {formatBytes(latestVersion?.file_size_bytes ?? null)}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Download size
            </p>
          </div>
          <div className="px-3 text-center">
            <p className="text-sm font-semibold text-white">
              {latestVersion?.version ?? "—"}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Version
            </p>
          </div>
        </section>

        {/* Install actions */}
        <section className="mt-5 flex flex-wrap items-center gap-3">
          <DownloadButton
            slug={app.slug}
            version={latestVersion?.version}
            directUrl={app.download_url}
            disabled={!app.download_url && !latestVersion}
            storeStyle
          />
          <Link
            href={`/start?app=${encodeURIComponent(app.slug)}&service=mobile-android`}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-[var(--text-muted)] transition hover:border-[var(--neon-cyan)]/40 hover:text-white"
            aria-label="Share interest / commission similar app"
          >
            <Share2 className="size-4" />
          </Link>
        </section>

        <ScreenshotGallery appName={app.name} screenshots={screenshots} />

        {!screenshots.length ? (
          <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-[var(--text-muted)]">
            Screenshots will appear here once uploaded in Admin → Apps.
          </p>
        ) : null}

        <ExpandableAbout text={aboutText} />

        {latestVersion?.changelog ? (
          <section className="border-b border-white/8 py-8">
            <h2 className="font-display text-xl text-white md:text-2xl">What&apos;s new</h2>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Version {latestVersion.version} · Updated {updatedLabel}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-[var(--text-muted)]">
              {latestVersion.changelog}
            </p>
          </section>
        ) : null}

        {features.length ? (
          <section className="border-b border-white/8 py-8">
            <h2 className="font-display text-xl text-white md:text-2xl">Features</h2>
            <ul className="mt-5 space-y-3">
              {features.map((feature, index) => (
                <li key={`${feature.title}-${index}`} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--neon-cyan)]" />
                  <div>
                    <p className="text-sm font-medium text-white">{feature.title}</p>
                    {feature.description ? (
                      <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                        {feature.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="border-b border-white/8 py-8">
          <h2 className="font-display mb-5 text-xl text-white md:text-2xl">App info</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Version", value: latestVersion?.version ?? "—" },
              { label: "Updated on", value: updatedLabel },
              { label: "Download size", value: formatBytes(latestVersion?.file_size_bytes ?? null) },
              {
                label: "Requires",
                value: app.min_android_version
                  ? `Android ${app.min_android_version}+`
                  : "Android device",
              },
              { label: "Offered by", value: siteConfig.name },
              { label: "Category", value: categoryName },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/[0.03] px-4 py-3">
                <dt className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
          {(app.tech_stack ?? []).length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {app.tech_stack?.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="border-b border-white/8 py-8">
          <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <Info className="mt-0.5 size-5 shrink-0 text-[var(--neon-cyan)]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Safe install</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                Downloads come from QuoreStack storage or a verified Expo build link.
                Android may ask you to allow installs from your browser.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 text-center">
          <h2 className="font-display text-2xl text-white">Need a custom build?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-muted)]">
            Commission an Android app like {app.name} — scoped, built, and launched with you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <NeonButton href={`/start?app=${encodeURIComponent(app.slug)}&service=mobile-android`}>
              Start a project
            </NeonButton>
            <NeonButton href="/apps" variant="ghost">
              More apps
            </NeonButton>
          </div>
        </section>

        {relatedApps?.length ? (
          <section className="pb-10">
            <h2 className="font-display mb-5 text-xl text-white md:text-2xl">Similar apps</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedApps.map((relatedApp) => (
                <AppCard key={relatedApp.id} app={relatedApp} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Sticky mobile install bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070b12]/95 px-4 py-3 backdrop-blur md:hidden">
        <DownloadButton
          slug={app.slug}
          version={latestVersion?.version}
          directUrl={app.download_url}
          disabled={!app.download_url && !latestVersion}
          storeStyle
          fullWidth
        />
      </div>
    </main>
  );
}
