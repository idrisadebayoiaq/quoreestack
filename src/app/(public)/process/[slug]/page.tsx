import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { NeonButton } from "@/components/ui/NeonButton";
import { getProcessStep, processSteps } from "@/lib/process";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return processSteps.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const step = getProcessStep(slug);
  if (!step) return { title: "Process not found" };

  return {
    title: `${step.title} — My Process`,
    description: step.summary,
    openGraph: {
      title: `${step.title} | QuoreStack Process`,
      description: step.summary,
      images: [{ url: step.image, alt: `${step.title} process` }],
    },
  };
}

export default async function ProcessDetailPage({ params }: Props) {
  const { slug } = await params;
  const step = getProcessStep(slug);
  if (!step) notFound();

  const index = processSteps.findIndex((item) => item.slug === slug);
  const previous = processSteps[index - 1];
  const next = processSteps[index + 1];

  return (
    <main>
      <section className="relative min-h-[70vh] overflow-hidden border-b border-[var(--border-glow)]">
        <Image
          src={step.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/88 to-[#050810]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6">
          <Link
            href="/#process"
            className="font-mono-label mb-8 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
          >
            <ArrowLeft className="size-4" /> Back to process
          </Link>
          <p className="font-mono-label text-xs uppercase tracking-[0.35em] text-[var(--neon-cyan)]">
            Process 0{index + 1}
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold text-white md:text-6xl">
            {step.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {step.summary}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionHeading index={2} eyebrow="Focus" title="What this stage unlocks" />
          <ul className="mt-2 space-y-4">
            {step.outcomes.map((item) => (
              <li key={item} className="flex gap-3 text-[var(--text-muted)]">
                <Check className="mt-1 size-5 shrink-0 text-[var(--neon-cyan)]" />
                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <SectionHeading index={3} eyebrow="Workstream" title="How we execute" />
            <div className="mt-2 space-y-4">
              {step.activities.map((item, i) => (
                <div
                  key={item}
                  className="border-l border-[var(--neon-cyan)]/40 pl-5"
                >
                  <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--neon-cyan)]">
                    Step 0{i + 1}
                  </p>
                  <p className="mt-2 text-lg text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 backdrop-blur-md lg:sticky lg:top-24">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-[var(--neon-magenta)]">
            Deliverables
          </p>
          <ul className="mt-5 space-y-3">
            {step.deliverables.map((item) => (
              <li
                key={item}
                className="border-b border-white/5 pb-3 text-sm text-[var(--text-muted)] last:border-0"
              >
                {item}
              </li>
            ))}
          </ul>
          <NeonButton href="/contact" className="mt-8 w-full">
            Start with this stage
          </NeonButton>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <SectionHeading index={4} eyebrow="Pipeline" title="Continue the journey" />
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {previous ? (
            <Link
              href={`/process/${previous.slug}`}
              className="group border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 transition hover:border-[var(--neon-cyan)]/50"
            >
              <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                Previous
              </p>
              <p className="font-display mt-2 flex items-center gap-2 text-2xl text-white">
                <ArrowLeft className="size-5 text-[var(--neon-cyan)] transition group-hover:-translate-x-1" />
                {previous.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/process/${next.slug}`}
              className="group border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 text-right transition hover:border-[var(--neon-cyan)]/50"
            >
              <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                Next
              </p>
              <p className="font-display mt-2 flex items-center justify-end gap-2 text-2xl text-white">
                {next.title}
                <ArrowRight className="size-5 text-[var(--neon-cyan)] transition group-hover:translate-x-1" />
              </p>
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
