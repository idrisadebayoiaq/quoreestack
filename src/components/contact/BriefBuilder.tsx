"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import type { EngagementPackage } from "@/lib/packages";

const goals = [
  "Launch a marketing website",
  "Build a web app / dashboard",
  "Ship an Android app",
  "API / backend system",
  "MVP prototype",
  "Improve an existing product",
];

const budgets = [
  "Under ₦500k / $400",
  "₦500k–₦1.5m / $400–$1,200",
  "₦1.5m–₦4m / $1,200–$3,000",
  "₦4m+ / $3,000+",
  "Not sure yet",
];

const timelines = ["ASAP", "2–4 weeks", "1–2 months", "3+ months", "Flexible"];

const serviceGoalMap: Record<string, string> = {
  "full-stack-web": "Build a web app / dashboard",
  "mobile-android": "Ship an Android app",
  "api-backend": "API / backend system",
  "mvp-prototype": "MVP prototype",
};

type BriefState = {
  goal: string;
  packageSlug: string;
  budget: string;
  timeline: string;
  details: string;
};

function resolveInitialGoal(
  service: string,
  project: string,
  app: string,
): string {
  if (service && serviceGoalMap[service]) return serviceGoalMap[service];
  if (project) return `Project like ${project.replace(/-/g, " ")}`;
  if (app) return `App like ${app.replace(/-/g, " ")}`;
  if (service) return service.replace(/-/g, " ");
  return "";
}

export function BriefBuilder({ packages }: { packages: EngagementPackage[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("package") ?? "";
  const initialService = searchParams.get("service") ?? "";
  const initialProject = searchParams.get("project") ?? "";
  const initialApp = searchParams.get("app") ?? "";

  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<BriefState>({
    goal: resolveInitialGoal(initialService, initialProject, initialApp),
    packageSlug: initialPackage,
    budget: "",
    timeline: "",
    details: initialService
      ? `Interested in the ${initialService.replace(/-/g, " ")} service.`
      : "",
  });

  const selectedPackage = useMemo(
    () => packages.find((item) => item.slug === brief.packageSlug),
    [packages, brief.packageSlug],
  );

  function next() {
    setStep((value) => Math.min(value + 1, 2));
  }

  function back() {
    setStep((value) => Math.max(value - 1, 0));
  }

  function submit() {
    const params = new URLSearchParams();
    if (selectedPackage) {
      params.set("subject", `${selectedPackage.name} inquiry`);
      params.set("package", selectedPackage.slug);
    } else if (brief.goal) {
      params.set("subject", brief.goal);
    }

    if (initialService) {
      params.set("service", initialService);
    } else if (brief.goal.toLowerCase().includes("android")) {
      params.set("service", "mobile-android");
    } else if (
      brief.goal.toLowerCase().includes("api") ||
      brief.goal.toLowerCase().includes("backend")
    ) {
      params.set("service", "api-backend");
    } else if (brief.goal.toLowerCase().includes("mvp")) {
      params.set("service", "mvp-prototype");
    } else if (brief.goal) {
      params.set("service", "full-stack-web");
    }

    if (initialProject) params.set("project", initialProject);
    if (initialApp) params.set("app", initialApp);

    const message = [
      brief.goal ? `Goal: ${brief.goal}` : null,
      initialService ? `Service: ${initialService}` : null,
      initialProject ? `Reference project: ${initialProject}` : null,
      initialApp ? `Reference app: ${initialApp}` : null,
      selectedPackage ? `Package: ${selectedPackage.name}` : null,
      brief.budget ? `Budget: ${brief.budget}` : null,
      brief.timeline ? `Timeline: ${brief.timeline}` : null,
      brief.details ? `Details:\n${brief.details}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "quorestack-brief",
        JSON.stringify({
          budget: brief.budget,
          message,
          subject: params.get("subject") ?? "",
        }),
      );
    }

    if (brief.budget) params.set("budget", brief.budget);
    router.push(`/contact?${params.toString()}`);
  }

  const canContinue =
    step === 0
      ? Boolean(brief.goal || brief.packageSlug)
      : step === 1
        ? Boolean(brief.budget && brief.timeline)
        : brief.details.trim().length >= 10;

  return (
    <div className="border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 md:p-8">
      <div className="mb-8 flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index <= step ? "bg-[var(--neon-cyan)]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {step === 0 ? (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl text-white">What do you want to build?</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Pick a goal or an engagement package to get started.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {goals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setBrief((current) => ({ ...current, goal }))}
                className={`rounded-sm border px-3 py-2 text-left text-sm transition ${
                  brief.goal === goal
                    ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                    : "border-[var(--border-glow)] text-[var(--text-muted)] hover:border-[var(--neon-cyan)]/50"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
          {packages.length ? (
            <div>
              <p className="font-mono-label mb-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Or choose a package
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {packages.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() =>
                      setBrief((current) => ({
                        ...current,
                        packageSlug: item.slug,
                        goal: current.goal || item.summary,
                      }))
                    }
                    className={`rounded-sm border p-4 text-left transition ${
                      brief.packageSlug === item.slug
                        ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                        : "border-[var(--border-glow)] hover:border-[var(--neon-cyan)]/40"
                    }`}
                  >
                    <p className="font-display text-white">{item.name}</p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">{item.timeline}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl text-white">Budget & timeline</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              This helps me propose a realistic scope.
            </p>
          </div>
          <div>
            <p className="font-mono-label mb-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Budget range
            </p>
            <div className="flex flex-wrap gap-3">
              {budgets.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => setBrief((current) => ({ ...current, budget }))}
                  className={`rounded-sm border px-3 py-2 text-sm transition ${
                    brief.budget === budget
                      ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                      : "border-[var(--border-glow)] text-[var(--text-muted)]"
                  }`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono-label mb-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Ideal timeline
            </p>
            <div className="flex flex-wrap gap-3">
              {timelines.map((timeline) => (
                <button
                  key={timeline}
                  type="button"
                  onClick={() => setBrief((current) => ({ ...current, timeline }))}
                  className={`rounded-sm border px-3 py-2 text-sm transition ${
                    brief.timeline === timeline
                      ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                      : "border-[var(--border-glow)] text-[var(--text-muted)]"
                  }`}
                >
                  {timeline}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl text-white">Project details</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Share features, users, constraints, or links to references.
            </p>
          </div>
          <textarea
            value={brief.details}
            onChange={(event) =>
              setBrief((current) => ({ ...current, details: event.target.value }))
            }
            rows={8}
            className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
            placeholder="Example: I need an Android app for appointment booking with admin dashboard and WhatsApp notifications..."
          />
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="font-mono-label inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <NeonButton type="button" onClick={next} disabled={!canContinue}>
            Continue <ArrowRight className="size-4" />
          </NeonButton>
        ) : (
          <NeonButton type="button" onClick={submit} disabled={!canContinue}>
            Continue to contact
          </NeonButton>
        )}
      </div>
    </div>
  );
}
