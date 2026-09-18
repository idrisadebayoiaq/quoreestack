import Link from "next/link";
import { cn } from "@/lib/utils";

type NeonButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  disabled?: boolean;
};

const variants = {
  primary:
    "bg-[var(--neon-cyan)] text-[var(--bg-primary)] shadow-[var(--glow-md)] hover:brightness-110",
  secondary:
    "border border-[var(--neon-cyan)] bg-transparent text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10",
  ghost:
    "bg-transparent text-[var(--text-primary)] underline-offset-4 hover:underline hover:text-[var(--neon-cyan)]",
  danger:
    "border border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/15 text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/25",
};

export function NeonButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled,
}: NeonButtonProps) {
  const classes = cn(
    "font-mono-label inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition disabled:opacity-50",
    variants[variant],
    className,
  );

  if (href) {
    const external = /^https?:\/\//i.test(href);
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} data-cursor="hover" className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-cursor="hover"
      className={classes}
    >
      {children}
    </button>
  );
}
