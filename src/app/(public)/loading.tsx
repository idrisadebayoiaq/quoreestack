export default function PublicLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-4 py-20 md:px-6">
      <div className="h-3 w-40 bg-cyan-300/15" />
      <div className="mt-6 h-12 max-w-2xl bg-white/10" />
      <div className="mt-4 h-5 max-w-xl bg-white/5" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-64 border border-[var(--border-glow)] bg-[var(--bg-glass)]"
          />
        ))}
      </div>
    </main>
  );
}
