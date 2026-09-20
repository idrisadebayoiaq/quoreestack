import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import {
  CategoryCard,
  ProjectCard,
  SectionCta,
} from "@/components/cards/ContentCards";
import { NeonButton } from "@/components/ui/NeonButton";
import {
  getPublishedCategories,
  getPublishedProjects,
} from "@/lib/data/content";

const processSteps = [
  {
    step: "01",
    title: "Discover",
    text: "Clarify goals, users, and constraints before writing a line of code.",
  },
  {
    step: "02",
    title: "Design & build",
    text: "Ship iterative UI and backend slices with clear milestones.",
  },
  {
    step: "03",
    title: "Harden",
    text: "Auth, validation, performance, and production readiness checks.",
  },
  {
    step: "04",
    title: "Launch",
    text: "Deploy, document, and hand over a maintainable system.",
  },
];

export const revalidate = 60;

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getPublishedProjects(),
    getPublishedCategories(),
  ]);

  return (
    <main>
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={1} eyebrow="Portfolio" title="Selected Work" />
          <p className="max-w-2xl text-lg text-[var(--text-muted)]">
            Web platforms and product builds from idea to deployment — each project is
            a case study of real full stack delivery.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading index={2} eyebrow="Browse" title="Filter by Domain" />
          {categories.length ? (
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  data-cursor="hover"
                  className="font-mono-label rounded-sm border border-[var(--border-glow)] px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                >
                  {category.name}
                </a>
              ))}
            </div>
          ) : (
            <div className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6">
              <p className="text-[var(--text-muted)]">
                Categories are being curated. Browse the full archive below, or start a
                project brief.
              </p>
              <div className="mt-4">
                <NeonButton href="/start" variant="secondary">
                  Start a project
                </NeonButton>
              </div>
            </div>
          )}
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading index={3} eyebrow="Archive" title="All Projects" />
          {projects.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <Reveal key={project.id} delay={index * 0.04}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-8 text-center">
              <p className="font-display text-xl text-white">Case studies coming soon</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-muted)]">
                Published work will appear here. Meanwhile, tell me what you want built.
              </p>
              <div className="mt-6">
                <NeonButton href="/start">Start a project</NeonButton>
              </div>
            </div>
          )}
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading index={4} eyebrow="Method" title="Delivery Process" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.05}>
                <div className="hud-corners rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5 backdrop-blur-md transition hover:-translate-y-1">
                  <p className="font-mono-label text-xs text-[var(--neon-cyan)]">
                    {item.step}
                  </p>
                  <h3 className="font-display mt-2 text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={5} eyebrow="Next" title="Start a Project" />
          <SectionCta
            href="/start"
            body="Have a product idea or need a full stack partner? Let's map the scope and build."
            button="Build a project brief"
          />
          {categories.length > 0 ? (
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : null}
        </section>
      </Reveal>
    </main>
  );
}
