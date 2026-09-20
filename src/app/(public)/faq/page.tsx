import type { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/animations/SectionHeading";
import { NeonButton } from "@/components/ui/NeonButton";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Common questions about working with ${siteConfig.author} and QuoreStack.`,
};

export const revalidate = 60;

const faqs = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Web platforms, Android apps, APIs, dashboards, and full-stack products — from MVP to production systems that need clean architecture and reliable delivery.",
  },
  {
    question: "How does your process work?",
    answer:
      "We start with discovery, agree on scope and timeline, then build in milestones you can review. You see progress early instead of waiting until the end.",
  },
  {
    question: "How do we start?",
    answer:
      "Use Start a Project to build a short brief, then send it through contact. I’ll reply with next steps and whether we’re a strong fit.",
  },
  {
    question: "Do you only work remotely?",
    answer:
      "Yes — remote-first from Osogbo, Nigeria, collaborating with clients worldwide over async updates and scheduled calls.",
  },
  {
    question: "Can you continue after launch?",
    answer:
      "Yes. Growth retainers cover feature iterations, performance care, and priority support after the first release.",
  },
  {
    question: "How are apps downloaded from QuoreStack?",
    answer:
      "Published Android apps can be installed from the Apps section via secure download links or Expo build URLs — no account required for public releases.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <section className="border-b border-[var(--border-glow)]">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-28">
          <p className="font-mono-label mb-4 text-xs uppercase tracking-[0.3em] text-[var(--neon-cyan)]">
            FAQ
          </p>
          <h1 className="font-display text-4xl text-white md:text-6xl">
            Answers before the kickoff
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Straight answers about scope, process, and how engagement works with{" "}
            {siteConfig.name}.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
          <SectionHeading index={1} eyebrow="Common questions" title="Quick clarity" />
          <div className="mt-4 divide-y divide-[var(--border-glow)] border-y border-[var(--border-glow)]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-white">
                  {faq.question}
                  <span className="font-mono-label text-[var(--neon-cyan)] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-7 text-[var(--text-muted)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center md:px-6">
        <p className="font-display text-2xl text-white">Still have a question?</p>
        <p className="mt-3 text-[var(--text-muted)]">
          Send a note — I&apos;ll reply with practical next steps.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <NeonButton href="/contact">Contact</NeonButton>
          <NeonButton href="/start" variant="secondary">
            Start a project
          </NeonButton>
        </div>
      </section>
    </main>
  );
}
