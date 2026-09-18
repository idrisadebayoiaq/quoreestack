import { cn } from "@/lib/utils";

type GridBackgroundProps = {
  className?: string;
  withOrbs?: boolean;
  withScanlines?: boolean;
  withNoise?: boolean;
};

export function GridBackground({
  className,
  withOrbs = true,
  withScanlines = true,
  withNoise = true,
}: GridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />

      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {withOrbs ? (
        <>
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[var(--neon-cyan)] opacity-[0.08] blur-[100px]" />
          <div className="absolute -right-20 bottom-32 h-96 w-96 rounded-full bg-[var(--neon-magenta)] opacity-[0.07] blur-[120px]" />
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--neon-cyan)] opacity-[0.05] blur-[90px]" />
        </>
      ) : null}

      {withNoise ? (
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      ) : null}

      {withScanlines ? (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)",
          }}
        />
      ) : null}
    </div>
  );
}
