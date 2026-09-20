import Link from "next/link";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hoverAccent?: "cyan" | "magenta";
};

export function GlowCard({
  children,
  className,
  href,
  hoverAccent = "cyan",
}: GlowCardProps) {
  const classes = cn(
    "hud-corners group relative block overflow-hidden rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 backdrop-blur-md transition duration-300 ease-out",
    "hover:-translate-y-1 hover:border-[var(--neon-cyan)]/60",
    hoverAccent === "magenta" && "hover:border-[var(--neon-magenta)]/50",
    "hover:shadow-[var(--glow-sm)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} data-cursor="hover" className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <div data-cursor="hover" className={classes}>
      {children}
    </div>
  );
}
