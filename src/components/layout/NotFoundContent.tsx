import { NeonButton } from "@/components/ui/NeonButton";

export function NotFoundContent() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col justify-center px-4 py-24 md:px-6">
      <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
        404
      </p>
      <h1 className="font-display mt-4 text-5xl text-[var(--text-strong)] md:text-7xl">
        This page isn&apos;t here.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
        It may have moved, or it was never published. The work and the ways to get in
        touch are one click away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <NeonButton href="/">Back to home</NeonButton>
        <NeonButton href="/projects" variant="secondary">
          See the work
        </NeonButton>
        <NeonButton href="/start" variant="ghost">
          Start a project
        </NeonButton>
      </div>
    </main>
  );
}
