import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CategoryCard,
  ProjectCard,
  ServiceCard,
} from "@/components/cards/ContentCards";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import {
  DetailHero,
  DetailSection,
  EmptyState,
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
    .from("services")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("name, short_description, meta_title, meta_description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!service) return { title: "Service not found" };

  const title = service.meta_title || service.name;
  const description =
    service.meta_description ||
    service.short_description ||
    `Explore ${service.name} services.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: service.cover_image_url ? [service.cover_image_url] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!service) notFound();

  const [{ data: categoryLinks }, { data: projectLinks }] = await Promise.all([
    supabase
      .from("service_categories")
      .select("category_id")
      .eq("service_id", service.id),
    supabase
      .from("project_services")
      .select("project_id")
      .eq("service_id", service.id),
  ]);

  const categoryIds = (categoryLinks ?? []).map((link) => link.category_id);
  const projectIds = (projectLinks ?? []).map((link) => link.project_id);
  const { data: relatedServiceLinks } = categoryIds.length
    ? await supabase
        .from("service_categories")
        .select("service_id")
        .in("category_id", categoryIds)
        .neq("service_id", service.id)
    : { data: [] };
  const relatedServiceIds = Array.from(
    new Set((relatedServiceLinks ?? []).map((link) => link.service_id)),
  ).slice(0, 3);

  const [
    { data: categories },
    { data: projects },
    { data: relatedServices },
  ] = await Promise.all([
    categoryIds.length
      ? supabase
          .from("categories")
          .select("*")
          .eq("status", "published")
          .in("id", categoryIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] }),
    projectIds.length
      ? supabase
          .from("projects")
          .select("*")
          .eq("status", "published")
          .in("id", projectIds)
          .order("featured", { ascending: false })
          .limit(3)
      : Promise.resolve({ data: [] }),
    relatedServiceIds.length
      ? supabase
          .from("services")
          .select("*")
          .eq("status", "published")
          .in("id", relatedServiceIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] }),
  ]);

  const deliverables = Array.isArray(service.deliverables)
    ? service.deliverables.filter(
        (item): item is string => typeof item === "string" && Boolean(item),
      )
    : [];

  return (
    <main>
      <DetailHero
        eyebrow="Service capability"
        title={service.name}
        summary={service.short_description}
        imageUrl={service.cover_image_url}
        imageAlt={`${service.name} service cover`}
        accent="magenta"
        facts={
          service.pricing_note
            ? [{ label: "Engagement", value: service.pricing_note }]
            : []
        }
      />

      <DetailSection eyebrow="Overview" title="What this service unlocks">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <MarkdownBody
            content={service.long_description}
            fallback="The full service brief is being prepared. Get in touch for scope, fit, and availability."
          />
          <aside>
            <p className="font-display mb-4 text-lg text-white">Technology</p>
            <TagList
              items={service.technologies}
              emptyLabel="Technology selected per project"
            />
          </aside>
        </div>
      </DetailSection>

      <DetailSection eyebrow="Scope" title="Typical deliverables">
        {deliverables.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {deliverables.map((deliverable, index) => (
              <GlowCard key={`${deliverable}-${index}`}>
                <p className="font-mono-label text-[10px] text-[var(--neon-magenta)]">
                  0{index + 1}
                </p>
                <p className="mt-3 leading-7 text-white">{deliverable}</p>
              </GlowCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Scope shaped around the brief"
            body="Deliverables are tailored to product goals, constraints, and the existing stack."
          />
        )}
      </DetailSection>

      <DetailSection eyebrow="Proof" title="Projects using this service">
        {projects?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Case studies being linked"
            body="Published work using this capability will appear here."
          />
        )}
      </DetailSection>

      <DetailSection eyebrow="Domains" title="Where it applies">
        {categories?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Built for varied domains"
            body="This service is not limited to a published category. Share your use case to assess fit."
          />
        )}
      </DetailSection>

      <DetailSection eyebrow="Explore" title="Related services">
        {relatedServices?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((related) => (
              <ServiceCard key={related.id} service={related} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="A focused capability"
            body="Browse all services to assemble the right delivery mix."
          />
        )}
      </DetailSection>

      <section className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 pb-24 md:px-6">
        <NeonButton href={`/start?service=${encodeURIComponent(service.slug)}`}>
          Discuss this service
        </NeonButton>
        <NeonButton href="/services" variant="ghost">
          ← All services
        </NeonButton>
      </section>
    </main>
  );
}
