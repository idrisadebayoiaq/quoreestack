export function Ticker({ items }: { items: string[] }) {
  if (!items.length) return null;
  const half = [...items, ...items];
  const loop = [...half, ...half];

  return (
    <div aria-hidden className="overflow-hidden py-6">
      <div className="-mx-[2%] -rotate-1 overflow-hidden whitespace-nowrap bg-[var(--neon-cyan)] py-4 text-[var(--on-accent)]">
        <div className="animate-marquee font-display inline-flex gap-12 text-2xl tracking-[0.08em] md:text-[1.7rem]">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-12">
              {item}
              <span className="text-xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
