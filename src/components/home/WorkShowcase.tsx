import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/content";
import { originLabels, projectOrigin } from "@/lib/projects";
import { cn, isOptimizableImage } from "@/lib/utils";
import { Reveal } from "@/components/animations/Reveal";

function OriginTag({ project }: { project: Project }) {
  const origin = projectOrigin(project);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        origin === "client"
          ? "border-[var(--neon-green)]/40 text-[var(--neon-green)]"
          : "border-[var(--line-strong)] text-[var(--text-muted)]",
      )}
    >
      {originLabels[origin]}
    </span>
  );
}

function ShowcaseItem({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-secondary)]",
          large ? "aspect-[16/9]" : "aspect-[4/3]",
        )}
      >
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={`${project.title} website`}
            fill
            unoptimized={!isOptimizableImage(project.thumbnail_url)}
            sizes={large ? "(min-width: 1152px) 1104px, 100vw" : "(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw"}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : null}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
            <OriginTag project={project} />
            {project.client_type && projectOrigin(project) === "client" ? (
              <span>{project.client_type}</span>
            ) : null}
            {project.year ? <span>· {project.year}</span> : null}
          </div>
          <h3
            className={cn(
              "font-display mt-3 text-[var(--text-strong)]",
              large ? "text-3xl md:text-4xl" : "text-2xl",
            )}
          >
            {project.title}
          </h3>
          {project.short_description ? (
            <p className="mt-2 max-w-2xl leading-7 text-[var(--text-muted)]">
              {project.short_description}
            </p>
          ) : null}
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-9 size-5 shrink-0 text-[var(--text-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--neon-cyan)]"
        />
      </div>
    </Link>
  );
}

export function WorkShowcase({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const [lead, ...rest] = projects;

  return (
    <div className="space-y-16">
      <Reveal>
        <ShowcaseItem project={lead} large />
      </Reveal>
      {rest.length ? (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {rest.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <ShowcaseItem project={project} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </div>
  );
}
