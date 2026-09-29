import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProcessStep } from "@/lib/process";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid border-t border-[var(--line)] md:grid-cols-5">
      {steps.map((step, index) => (
        <li
          key={step.slug}
          className="border-b border-[var(--line)] md:border-b-0 md:border-r md:last:border-r-0"
        >
          <Link
            href={`/process/${step.slug}`}
            className="group flex h-full flex-col py-7 transition md:px-5 md:first:pl-0"
          >
            <span className="font-mono-label font-mono-keep text-sm text-[var(--neon-cyan)]">
              0{index + 1}
            </span>
            <h3 className="font-display mt-4 text-2xl text-[var(--text-strong)]">
              {step.title}
            </h3>
            <p className="mt-3 flex-1 text-[15px] leading-7 text-[var(--text-muted)]">
              {step.short}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-strong)] opacity-70 transition group-hover:opacity-100">
              Details
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
