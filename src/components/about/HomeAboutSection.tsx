import { Reveal } from "@/components/animations/Reveal";
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
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <Reveal>
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
              Who you&apos;ll work with
            </p>
            <h2 className="font-display text-3xl text-[var(--text-strong)] md:text-5xl">
              {siteConfig.author}
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-[var(--text-body)]">
              {about?.bio ??
                `I am ${siteConfig.author}, a full stack developer building websites, Android apps, and backend systems that ship.`}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-[var(--text-muted)]">Based in</dt>
                <dd className="mt-1 font-semibold text-[var(--text-strong)]">
                  {about?.location?.split("·")[0]?.trim() || "Osogbo, Nigeria"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--text-muted)]">Experience</dt>
                <dd className="mt-1 font-semibold text-[var(--text-strong)]">{yearsLabel} years</dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--text-muted)]">Works with</dt>
                <dd className="mt-1 font-semibold text-[var(--text-strong)]">Clients worldwide</dd>
              </div>
            </dl>
            <div className="mt-9 flex flex-wrap gap-3">
              <NeonButton href="/about" variant="secondary">
                More about me
              </NeonButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
