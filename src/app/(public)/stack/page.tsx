import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { NeonButton } from "@/components/ui/NeonButton";
import { createStaticClient } from "@/lib/supabase/static";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stack",
  description: `Engineering stack used by ${siteConfig.author} across web, mobile, and backend delivery.`,
};

export const revalidate = 60;

const layers = [
  {
    title: "Interfaces",
    items: [
      "Next.js / React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "WebGL (selective)",
    ],
  },
  {
    title: "Mobile",
    items: ["React Native / Expo", "Android packaging", "EAS / APK delivery"],
  },
  {
    title: "Backend & data",
    items: [
      "Supabase / PostgreSQL",
      "Node.js APIs",
      "Auth & RLS",
      "Edge Functions",
    ],
  },
  {
    title: "Delivery",
    items: ["Vercel", "CI-ready repos", "Staging → production", "Handoff docs"],
  },
];

export default async function StackPage() {
  const supabase = createStaticClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("title, slug, tech_stack")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  const tagCounts = new Map<string, number>();
  for (const project of projects ?? []) {
    const tags = Array.isArray(project.tech_stack) ? project.tech_stack : [];
    for (const tag of tags) {
      if (typeof tag !== "string" || !tag.trim()) continue;
      const key = tag.trim();
      tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
    }
  }

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 16);

  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
            {siteConfig.name}
          </p>
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Stack
          </p>
          <h1 className="font-display max-w-3xl text-4xl text-white md:text-6xl">
            Engineering depth without the home-page clutter
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            A focused toolkit for shipping production web, Android, and API systems —
            chosen for maintainability, speed, and clean handoffs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NeonButton href="/projects">See it in work</NeonButton>
            <NeonButton href="/start" variant="secondary">
              Start a project
            </NeonButton>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Layers
          </p>
          <h2 className="font-display mb-10 text-3xl text-white md:text-4xl">
            What I build with
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {layers.map((layer) => (
              <div
                key={layer.title}
                className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6"
              >
                <h3 className="font-display text-xl text-white">{layer.title}</h3>
                <ul className="mt-4 space-y-2">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono-label text-xs uppercase tracking-wider text-[var(--text-muted)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {popularTags.length ? (
        <Reveal>
          <section className="border-y border-[var(--border-glow)] bg-[var(--bg-secondary)]/40">
            <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
              <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
                In published work
              </p>
              <h2 className="font-display mb-8 text-3xl text-white">
                Technologies that show up most
              </h2>
              <div className="flex flex-wrap gap-3">
                {popularTags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-[var(--border-glow)] bg-black/20 px-3 py-2 text-sm text-white"
                  >
                    {tag}
                    <span className="ml-2 font-mono-label text-[10px] text-[var(--text-muted)]">
                      ×{count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <p className="font-mono-label mb-3 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            Evidence
          </p>
          <h2 className="font-display mb-8 text-3xl text-white">
            Stack by project
          </h2>
          <div className="space-y-4">
            {(projects ?? []).map((project) => {
              const tags = Array.isArray(project.tech_stack)
                ? project.tech_stack.filter(
                    (item): item is string => typeof item === "string",
                  )
                : [];
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5 transition hover:border-[var(--neon-cyan)]/50"
                >
                  <p className="font-display text-xl text-white">{project.title}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.length ? (
                      tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">
                        Stack detailed on the case study
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-8 text-center md:p-10">
          <p className="font-display text-2xl text-white md:text-3xl">
            Need a different stack?
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
            Bring constraints. I&apos;ll recommend tools that fit the product — not a
            fixed template.
          </p>
          <div className="mt-8">
            <NeonButton href="/contact">Discuss your stack</NeonButton>
          </div>
        </div>
      </section>
    </main>
  );
}
