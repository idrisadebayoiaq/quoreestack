import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
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
  MediaGallery,
  MetricGrid,
  TagList,
} from "@/components/details/DetailLayout";
import { NeonButton } from "@/components/ui/NeonButton";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title, short_description, meta_title, meta_description, thumbnail_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) return { title: "Project not found" };

  const title = project.meta_title || project.title;
  const description =
    project.meta_description ||
    project.short_description ||
    `Explore the ${project.title} case study.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.thumbnail_url ? [project.thumbnail_url] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) notFound();

  const [{ data: categoryLinks }, { data: serviceLinks }] = await Promise.all([
    supabase
      .from("project_categories")
      .select("category_id")
      .eq("project_id", project.id),
    supabase
      .from("project_services")
      .select("service_id")
      .eq("project_id", project.id),
  ]);

  const categoryIds = Array.from(
    new Set([
      ...(project.primary_category_id ? [project.primary_category_id] : []),
      ...(categoryLinks ?? []).map((link) => link.category_id),
    ]),
  );
  const serviceIds = (serviceLinks ?? []).map((link) => link.service_id);

  let relatedQuery = supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .neq("id", project.id)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(3);

  if (project.primary_category_id) {
    relatedQuery = relatedQuery.eq(
      "primary_category_id",
      project.primary_category_id,
    );
  }

  const [
    { data: categories },
    { data: services },
    { data: relatedProjects },
    { data: testimonialRows },
  ] = await Promise.all([
    categoryIds.length
      ? supabase
          .from("categories")
          .select("*")
          .eq("status", "published")
          .in("id", categoryIds)
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
    relatedQuery,
    supabase
      .from("testimonials")
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false }),
  ]);

  const relatedTestimonial =
    testimonialRows?.find((item) => {
      if (!item.company) return false;
      const company = item.company.toLowerCase();
      const title = project.title.toLowerCase();
      return title.includes(company) || company.includes(title.split(" ")[0] ?? "");
    }) ?? null;

  const results = Array.isArray(project.results)
    ? (project.results as Array<{ label?: string; value?: string }>)
    : [];
  const facts = [
    project.year ? { label: "Year", value: String(project.year) } : null,
    project.role ? { label: "Role", value: project.role } : null,
    project.duration ? { label: "Duration", value: project.duration } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <main>
      <DetailHero
        eyebrow={project.client_type || "Project case study"}
        title={project.title}
        summary={project.short_description}
        imageUrl={project.thumbnail_url}
        imageAlt={`${project.title} project cover`}
        facts={facts}
        actions={
          <>
            <NeonButton
              href={`/start?project=${encodeURIComponent(project.slug)}`}
            >
              Start a similar project
            </NeonButton>
            {project.live_url ? (
              <NeonButton href={project.live_url} variant="secondary">
                <ExternalLink className="size-4" />
                Preview
              </NeonButton>
            ) : null}
          </>
        }
      />

      <DetailSection eyebrow="01 · Challenge" title="The problem">
        <MarkdownBody
          content={project.short_description}
          fallback="This case study overview is being prepared."
        />
      </DetailSection>

      <DetailSection eyebrow="02 · Approach" title="How it was built">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <MarkdownBody
            content={project.long_description}
            fallback="A deeper project narrative is being prepared. The overview above captures the current scope."
          />
          <aside>
            <p className="font-display mb-4 text-lg text-white">03 · Stack</p>
            <TagList
              items={project.tech_stack}
              emptyLabel="Stack details coming soon"
            />
          </aside>
        </div>
      </DetailSection>

      {results.length ? (
        <DetailSection eyebrow="04 · Results" title="Measured outcomes">
          <MetricGrid metrics={results} />
        </DetailSection>
      ) : null}

      {relatedTestimonial ? (
        <DetailSection eyebrow="05 · Client voice" title="What they said">
          <figure className="max-w-3xl border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 md:p-8">
            <blockquote className="text-lg leading-8 text-slate-200">
              “{relatedTestimonial.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm text-[var(--text-muted)]">
              {relatedTestimonial.author_name}
              {relatedTestimonial.author_title
                ? ` · ${relatedTestimonial.author_title}`
                : ""}
              {relatedTestimonial.company ? ` · ${relatedTestimonial.company}` : ""}
            </figcaption>
          </figure>
        </DetailSection>
      ) : null}

      {project.gallery_urls?.length ? (
        <DetailSection eyebrow="Gallery" title="Inside the product">
          <MediaGallery images={project.gallery_urls} title={project.title} />
        </DetailSection>
      ) : null}

      <DetailSection eyebrow="Context" title="Domains and capabilities">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display mb-5 text-xl text-white">Categories</h3>
            {categories?.length ? (
              <div className="grid gap-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No category assigned"
                body="This case study has not been mapped to a public domain yet."
              />
            )}
          </div>
          <div>
            <h3 className="font-display mb-5 text-xl text-white">Services</h3>
            {services?.length ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Capabilities being mapped"
                body="Related service offerings will appear here once linked."
              />
            )}
          </div>
        </div>
      </DetailSection>

      <DetailSection eyebrow="Continue" title="Related projects">
        {relatedProjects?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((related) => (
              <ProjectCard key={related.id} project={related} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No related case studies yet"
            body="Browse the complete project archive for more shipped work."
          />
        )}
      </DetailSection>

      <section className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 pb-24 md:px-6">
        <NeonButton href={`/start?project=${encodeURIComponent(project.slug)}`}>
          Start a similar project
        </NeonButton>
        {project.live_url ? (
          <NeonButton href={project.live_url} variant="secondary">
            <ExternalLink className="size-4" />
            Preview
          </NeonButton>
        ) : null}
        {project.github_url ? (
          <NeonButton href={project.github_url} variant="ghost">
            View source
          </NeonButton>
        ) : null}
        <NeonButton href="/projects" variant="ghost">
          ← All projects
        </NeonButton>
      </section>
    </main>
  );
}
