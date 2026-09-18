export default function AppsLoading() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-4 py-20 md:px-6">
      <div className="h-3 w-48 rounded bg-[var(--neon-cyan)]/20" />
      <div className="mt-6 h-14 max-w-2xl rounded bg-white/10" />
      <div className="mt-4 h-6 max-w-xl rounded bg-white/5" />
      <div className="mt-16 h-16 rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)]" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)]"
          />
        ))}
      </div>
      <p className="font-mono-label mt-8 text-center text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
        Synchronizing app registry...
      </p>
    </main>
  );
}
