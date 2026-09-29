export default function PublicLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading"
      className="mx-auto w-full max-w-6xl animate-pulse px-4 py-20 md:px-6"
    >
      <div className="h-3 w-28 rounded-full bg-[var(--line-strong)]" />
      <div className="mt-6 h-12 max-w-2xl rounded-xl bg-[var(--line-strong)]" />
      <div className="mt-4 h-5 max-w-xl rounded-full bg-[var(--line)]" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-secondary)]">
            <div className="aspect-[16/10] bg-[var(--line)]" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded-full bg-[var(--line-strong)]" />
              <div className="h-4 w-full rounded-full bg-[var(--line)]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
