import { cn } from "@/lib/utils";

type MarqueeStripProps = {
  items: string[];
  className?: string;
};

export function MarqueeStrip({ items, className }: MarqueeStripProps) {
  const row = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-[var(--border-glow)] bg-[var(--bg-secondary)]/50 py-4",
        className,
      )}
    >
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono-label text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]"
          >
            <span className="mr-3 text-[var(--neon-cyan)]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
