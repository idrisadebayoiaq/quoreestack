import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { NeonButton } from "@/components/ui/NeonButton";
import { yearsOfExperienceLabel } from "@/lib/experience";
import { getSiteSetting } from "@/lib/data/content";
import { siteConfig } from "@/lib/utils";

export async function HomeAboutSection() {
  const about = await getSiteSetting<{
    location?: string;
    availability?: string;
    bio?: string;
  }>("about");
  const yearsLabel = yearsOfExperienceLabel();

  return (
    <Reveal>
      <section
        id="about"
        className="border-y border-[var(--border-glow)] bg-[var(--bg-glass)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <SectionHeading
            index={2}
            eyebrow="About"
            title={`Meet ${siteConfig.author.split(" ")[0]}`}
          />
          <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden border border-[var(--border-glow)]/70">
              <Image
                src="/images/quoreeb-adebayo.png"
                alt={`${siteConfig.author}, Full Stack Developer`}
                fill
                sizes="(min-width: 768px) 32vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-xl text-white">
                  {siteConfig.author}
                </p>
                <p className="font-mono-label mt-1 text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
                  {siteConfig.title}
                </p>
              </div>
            </div>

            <div>
              <p className="text-lg leading-8 text-[var(--text-muted)]">
                {about?.bio ??
                  `I am ${siteConfig.author}, a Full Stack Developer building web platforms, Android apps, and backend systems that ship.`}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
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
                <NeonButton href="/about" variant="secondary">
                  Full profile
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
