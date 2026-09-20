import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { GlowCard } from "@/components/ui/GlowCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { yearsOfExperienceLabel } from "@/lib/experience";
import { siteConfig } from "@/lib/utils";
import { getSiteSetting } from "@/lib/data/content";

const journey = [
  {
    year: "2023",
    title: "Foundation",
    text: "Started shipping full stack web projects and learning production workflows end-to-end.",
  },
  {
    year: "2024",
    title: "Mobile & backends",
    text: "Expanded into Android apps, APIs, and database-driven platforms for real clients.",
  },
  {
    year: "2025–26",
    title: "QuoreStack",
    text: "Building a branded portfolio + APK distribution system to showcase and share work professionally.",
  },
];

const skillGroups = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    name: "Backend",
    items: ["Node.js", "Supabase", "PostgreSQL", "REST APIs", "Auth / RLS"],
  },
  {
    name: "Mobile",
    items: ["Android", "Flutter", "React Native", "APK delivery"],
  },
  {
    name: "Product",
    items: ["MVP design", "UX implementation", "Deployment", "CMS"],
  },
];

const tools = [
  "Next.js",
  "React",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Node.js",
  "Tailwind",
  "GSAP",
  "Vercel",
  "Git",
  "Figma",
  "Android Studio",
];

const values = [
  {
    title: "Ship real systems",
    text: "Not just demos — production-minded architecture, security, and maintainability.",
  },
  {
    title: "Clear communication",
    text: "Clients get clarity on scope, progress, and tradeoffs without jargon overload.",
  },
  {
    title: "Own the stack",
    text: "Interface to infrastructure — UI, APIs, data, and deployment as one product.",
  },
];

export default async function AboutPage() {
  const about = await getSiteSetting<{
    location?: string;
    availability?: string;
    bio?: string;
  }>("about");
  const yearsLabel = yearsOfExperienceLabel();

  return (
    <main>
      <Reveal variant="fade-up">
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading
            index={1}
            eyebrow="Profile"
            title="About Quoreeb"
          />
          <div className="grid items-start gap-10 md:grid-cols-[1fr_1.4fr]">
            <GlowCard className="p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src="/images/quoreeb-adebayo.png"
                  alt={`${siteConfig.author}, Full Stack Developer`}
                  fill
                  priority
                  sizes="(min-width: 768px) 36vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <p className="font-display text-xl text-white">
                    {siteConfig.author}
                  </p>
                  <p className="font-mono-label mt-1 text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
                    {siteConfig.title}
                  </p>
                </div>
              </div>
            </GlowCard>
            <div>
              <p className="mb-6 text-lg leading-relaxed text-[var(--text-muted)]">
                {about?.bio ??
                  `I am ${siteConfig.author}, a Full Stack Developer building web platforms, Android apps, and backend systems that ship.`}
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="font-mono-label rounded-sm border border-[var(--border-glow)] px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {about?.location ?? "Osogbo, Nigeria · Remote worldwide"}
                </span>
                <span className="font-mono-label rounded-sm border border-[var(--neon-cyan)]/40 px-3 py-2 text-xs uppercase tracking-wider text-[var(--neon-cyan)]">
                  {yearsLabel} years experience
                </span>
                <span className="font-mono-label rounded-sm border border-[var(--neon-green)]/40 px-3 py-2 text-xs uppercase tracking-wider text-[var(--neon-green)]">
                  {about?.availability ?? "Open for projects"}
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <NeonButton href="/start">Work with me</NeonButton>
                <NeonButton href="/stack" variant="secondary">
                  View stack
                </NeonButton>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={2} eyebrow="Timeline" title="The Journey" />
          <div className="space-y-6 border-l border-[var(--border-glow)] pl-6">
            {journey.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-[var(--neon-cyan)] shadow-[var(--glow-sm)]" />
                <p className="font-mono-label text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
                  {item.year}
                </p>
                <h3 className="font-display mt-1 text-xl text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[var(--text-muted)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={3} eyebrow="Capabilities" title="Skills" />
          <div className="grid gap-6 md:grid-cols-2">
            {skillGroups.map((group) => (
              <GlowCard key={group.name}>
                <h3 className="font-display mb-4 text-lg text-white">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono-label rounded-sm bg-[var(--neon-cyan)]/10 px-2.5 py-1 text-xs uppercase tracking-wider text-[var(--neon-cyan)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </GlowCard>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={4} eyebrow="Stack" title="Tools I Use" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {tools.map((tool) => (
              <div
                key={tool}
                className="hud-corners rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] px-4 py-5 text-center backdrop-blur-md transition hover:-translate-y-1"
              >
                <span className="font-mono-label text-sm uppercase tracking-wider text-[var(--text-primary)]">
                  {tool}
                </span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <SectionHeading index={5} eyebrow="Philosophy" title="How I Work" />
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <GlowCard key={item.title} hoverAccent="magenta">
                <h3 className="font-display mb-2 text-xl text-white">
                  {item.title}
                </h3>
                <p className="text-[var(--text-muted)]">{item.text}</p>
              </GlowCard>
            ))}
          </div>
          <div className="mt-12 text-center">
            <NeonButton href="/projects">See the work</NeonButton>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
