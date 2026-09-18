import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CategoryCard,
  ProjectCard,
  ServiceCard,
} from "@/components/cards/ContentCards";
import {
  DetailHero,
  DetailSection,
  EmptyState,
  MediaGallery,
  ProseText,
  TagList,
} from "@/components/details/DetailLayout";
import { GlowCard } from "@/components/ui/GlowCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("categories")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, short_description, meta_title, meta_description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!category) return { title: "Category not found" };

  const title = category.meta_title || category.name;
  const description =
    category.meta_description ||
    category.short_description ||
    `Explore work and services in ${category.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.cover_image_url ? [category.cover_image_url] : undefined,
    },
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!category) notFound();

  const [{ data: projectLinks }, { data: serviceLinks }] = await Promise.all([
    supabase
      .from("project_categories")
      .select("project_id")
      .eq("category_id", category.id),
    supabase
      .from("service_categories")
      .select("service_id")
      .eq("category_id", category.id),
  ]);

  const projectIds = (projectLinks ?? []).map((row) => row.project_id);
  const serviceIds = (serviceLinks ?? []).map((row) => row.service_id);

  const [
    { data: projects },
    { data: services },
    { data: apps },
    { data: relatedCategories },
  ] = await Promise.all([
    projectIds.length
      ? supabase
          .from("projects")
          .select("*")
          .eq("status", "published")
          .in("id", projectIds)
          .order("featured", { ascending: false })
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] }),
    serviceIds.length
      ? supabase
          .from("services")
          .select("*")
          .eq("status", "published")
          .in("id", serviceIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] }),
    supabase
      .from("mobile_apps")
      .select("*")
      .eq("status", "published")
      .eq("category_id", category.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("categories")
      .select("*")
      .eq("status", "published")
      .neq("id", category.id)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(3),
  ]);

  const screenshots = (apps ?? []).flatMap(
    (app) => app.screenshot_urls ?? [],
  );
  const facts = [
    projects?.length
      ? { label: "Projects", value: String(projects.length) }
      : null,
    services?.length
      ? { label: "Services", value: String(services.length) }
      : null,
    apps?.length ? { label: "Apps", value: String(apps.length) } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <main>
      <DetailHero
        eyebrow="Domain collection"
        title={category.name}
        summary={category.short_description}
        imageUrl={category.cover_image_url}
        imageAlt={`${category.name} category cover`}
        accent="magenta"
        facts={facts}
      />

      <DetailSection eyebrow="Overview" title={`Inside ${category.name}`}>
        <ProseText
          text={category.long_description}
          fallback="This collection is growing. Explore the linked work and capabilities below."
        />
      </DetailSection>

      <DetailSection eyebrow="Work" title="Projects in this domain">
        {projects?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published projects yet"
            body="New case studies in this domain will be collected here as they launch."
          />
        )}
      </DetailSection>

      <DetailSection eyebrow="Capabilities" title="Related services">
        {services?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No linked service yet"
            body="The domain is published, but its delivery capabilities are still being mapped."
          />
        )}
      </DetailSection>

      <DetailSection eyebrow="Products" title="Apps in this collection">
        {apps?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <GlowCard key={app.id} href={`/apps/${app.slug}`}>
                <p className="font-mono-label mb-3 text-[10px] uppercase tracking-[0.3em] text-[var(--neon-magenta)]">
                  Mobile product
                </p>
                <h3 className="font-display text-xl text-white">{app.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                  {app.tagline || app.short_description || "Product details coming soon."}
                </p>
                <div className="mt-5">
                  <TagList
                    items={app.tech_stack?.slice(0, 4)}
                    emptyLabel="Stack details coming soon"
                  />
                </div>
              </GlowCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published apps yet"
            body="Mobile products assigned to this domain will appear here."
          />
        )}
      </DetailSection>

      {screenshots.length ? (
        <DetailSection eyebrow="Gallery" title="Product snapshots">
          <MediaGallery images={screenshots} title={category.name} />
        </DetailSection>
      ) : null}

      <DetailSection eyebrow="Discover" title="Related categories">
        {relatedCategories?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedCategories.map((related) => (
              <CategoryCard key={related.id} category={related} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="This is the first collection"
            body="More public categories will appear here as the catalog expands."
          />
        )}
      </DetailSection>

      <section className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 pb-24 md:px-6">
        <NeonButton href="/projects">Browse all projects</NeonButton>
        <NeonButton href="/categories" variant="ghost">
          ← All categories
        </NeonButton>
      </section>
    </main>
  );
}
