import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { NeonButton } from "@/components/ui/NeonButton";
import type { Blog, Project, Service, Category } from "@/lib/data/content";

export function ProjectCard({ project }: { project: Project }) {
  const results = Array.isArray(project.results)
    ? (project.results as Array<{ label?: string; value?: string }>)
        .filter((item) => item?.label && item?.value)
        .slice(0, 2)
    : [];

  return (
    <GlowCard className="flex h-full flex-col p-0">
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="hover"
        className="block flex-1"
      >
        {project.thumbnail_url ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={project.thumbnail_url}
              alt=""
              fill
              sizes="(min-width: 768px) 30vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
          </div>
        ) : null}
        <div className="p-6 pb-4">
          <span className="font-mono-label mb-3 inline-block text-[10px] uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            {project.year ?? "Project"}
            {project.client_type ? ` · ${project.client_type}` : ""}
          </span>
          <h3 className="font-display mb-2 text-xl text-white">{project.title}</h3>
          <p className="mb-4 text-[var(--text-muted)]">
            {project.short_description}
          </p>
          {results.length ? (
            <div className="mb-4 grid grid-cols-2 gap-3">
              {results.map((result) => (
                <div
                  key={`${result.label}-${result.value}`}
                  className="border border-[var(--border-glow)]/60 bg-black/20 px-3 py-2"
                >
                  <p className="font-display text-sm text-[var(--neon-cyan)]">
                    {result.value}
                  </p>
                  <p className="font-mono-label mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {result.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          {project.tech_stack?.length ? (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="font-mono-label rounded-sm border border-[var(--border-glow)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
      {project.live_url ? (
        <div className="mt-auto border-t border-white/5 px-6 py-4">
          <NeonButton
            href={project.live_url}
            variant="secondary"
            className="w-full px-4 py-2 text-xs"
          >
            <ExternalLink className="size-3.5" />
            Preview
          </NeonButton>
        </div>
      ) : null}
    </GlowCard>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <GlowCard href={`/services/${service.slug}`} className="p-0">
      {service.cover_image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={service.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
        </div>
      ) : null}
      <div className="p-6">
        <h3 className="font-display mb-2 text-xl text-white">{service.name}</h3>
        <p className="mb-4 text-[var(--text-muted)]">
          {service.short_description}
        </p>
        {service.technologies?.length ? (
          <div className="flex flex-wrap gap-2">
            {service.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono-label rounded-sm border border-[var(--border-glow)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </GlowCard>
  );
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <GlowCard href={`/categories/${category.slug}`} hoverAccent="magenta" className="p-0">
      {category.cover_image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={category.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
        </div>
      ) : null}
      <div className="p-6">
        <div
          className="mb-4 h-1 w-12 rounded-full"
          style={{ backgroundColor: category.color ?? "var(--neon-cyan)" }}
        />
        <h3 className="font-display mb-2 text-xl text-white">{category.name}</h3>
        <p className="text-[var(--text-muted)]">{category.short_description}</p>
      </div>
    </GlowCard>
  );
}

export function BlogCard({ blog }: { blog: Blog }) {
  const dateLabel = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Draft";

  return (
    <GlowCard href={`/blog/${blog.slug}`} className="h-full p-0">
      {blog.cover_image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={blog.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
        </div>
      ) : null}
      <div className="p-6">
        <span className="font-mono-label mb-3 inline-block text-[10px] uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
          {dateLabel}
          {blog.reading_time_minutes ? ` · ${blog.reading_time_minutes} min` : ""}
        </span>
        <h3 className="font-display mb-2 text-xl text-white">{blog.title}</h3>
        <p className="mb-4 text-[var(--text-muted)]">{blog.short_description}</p>
        {blog.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono-label rounded-sm border border-[var(--border-glow)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </GlowCard>
  );
}

export function SectionCta({
  title,
  body,
  href = "/contact",
  button = "Get in touch",
}: {
  title?: string;
  body: string;
  href?: string;
  button?: string;
}) {
  return (
    <div className="text-center">
      {title ? (
        <p className="font-display mb-4 text-2xl text-white md:text-3xl">
          {title}
        </p>
      ) : null}
      <p className="mx-auto mb-8 max-w-xl text-[var(--text-muted)]">{body}</p>
      <NeonButton href={href}>{button}</NeonButton>
    </div>
  );
}
