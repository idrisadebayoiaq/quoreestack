import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProcessStep } from "@/lib/process";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, index) => (
        <li
          key={step.slug}
          className="relative border-t border-[var(--line)] before:absolute before:-top-[5px] before:left-0 before:size-[9px] before:bg-[var(--neon-cyan)]"
        >
          <Link
            href={`/process/${step.slug}`}
            className="group flex h-full flex-col py-8 pr-4 transition"
          >
            <span aria-hidden className="font-display text-outline text-6xl !font-extrabold leading-none">
              0{index + 1}
            </span>
            <h3 className="font-display mt-4 text-2xl text-[var(--text-strong)]">
              {step.title}
            </h3>
            <p className="mt-3 flex-1 text-[15px] leading-7 text-[var(--text-muted)]">
              {step.short}
            </p>
            <span className="font-mono-label mt-5 inline-flex items-center gap-1.5 text-xs uppercase text-[var(--neon-cyan)] opacity-80 transition group-hover:opacity-100">
              Details
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
