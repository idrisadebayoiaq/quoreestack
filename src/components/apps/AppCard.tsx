import { ArrowUpRight, Smartphone } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import type { PublicApp } from "./types";

export function AppCard({ app }: { app: PublicApp }) {
  return (
    <GlowCard href={`/apps/${app.slug}`} className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {app.icon_url ? (
            // App icons are managed content and may be hosted outside Next's image allowlist.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.icon_url}
              alt=""
              className="size-16 shrink-0 rounded-2xl border border-white/10 object-cover shadow-[var(--glow-sm)]"
            />
          ) : (
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10">
              <Smartphone className="size-7 text-[var(--neon-cyan)]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[var(--neon-cyan)]">
              Android release
            </p>
            <h3 className="font-display mt-1 truncate text-xl text-white">
              {app.name}
            </h3>
          </div>
        </div>
        <ArrowUpRight className="size-5 shrink-0 text-[var(--text-muted)] transition group-hover:text-[var(--neon-cyan)]" />
      </div>

      <p className="mt-5 line-clamp-3 flex-1 text-sm leading-6 text-[var(--text-muted)]">
        {app.tagline ?? app.short_description ?? "A focused mobile experience built for everyday use."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(app.tech_stack ?? []).slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="font-mono-label rounded-sm border border-[var(--border-glow)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </GlowCard>
  );
}
