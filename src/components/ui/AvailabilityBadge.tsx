import type { AvailabilitySetting } from "@/lib/packages";

export function AvailabilityBadge({
  availability,
  className = "",
}: {
  availability?: AvailabilitySetting | null;
  className?: string;
}) {
  const status = availability?.status ?? "open";
  const label =
    availability?.label ??
    (status === "open"
      ? "Available for selected projects"
      : status === "limited"
        ? "Limited openings"
        : status === "waitlist"
          ? "Waitlist open"
          : "Currently fully booked");

  const color =
    status === "open"
      ? "text-[var(--neon-green)] border-[var(--neon-green)]/40 bg-[var(--neon-green)]/5"
      : status === "limited"
        ? "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5"
        : status === "waitlist"
          ? "text-amber-300 border-amber-300/40 bg-amber-300/5"
          : "text-[var(--text-muted)] border-[var(--border-glow)] bg-white/5";

  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-sm border px-4 py-2 font-mono-label text-xs ${color} ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "closed" ? "bg-[var(--text-muted)]" : "animate-pulse bg-current"
          }`}
        />
        {label}
      </span>
      {availability?.next_opening ? (
        <span className="text-[10px] uppercase tracking-wider opacity-80">
          {availability.next_opening}
        </span>
      ) : null}
    </div>
  );
}
