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
    "hud-corners group relative block overflow-hidden rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 transition duration-300 ease-out",
    href && "hover:-translate-y-0.5 hover:shadow-[var(--glow-md)]",
    href && (hoverAccent === "magenta"
      ? "hover:border-[var(--neon-magenta)]/50"
      : "hover:border-[var(--line-strong)]"),
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
