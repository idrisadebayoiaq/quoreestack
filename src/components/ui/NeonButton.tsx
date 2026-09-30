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
    "chamfer px-6 py-3 bg-[var(--neon-cyan)] text-[var(--on-accent)] hover:bg-[var(--neon-magenta)]",
  secondary:
    "chamfer px-6 py-3 border border-[var(--line)] bg-white/[0.02] text-[var(--text-strong)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]",
  ghost:
    "px-1 py-2 bg-transparent text-[var(--text-muted)] hover:text-[var(--neon-cyan)]",
  danger:
    "px-5 py-2.5 border border-[var(--danger)]/50 bg-[var(--danger)]/10 text-[var(--danger)] hover:bg-[var(--danger)]/20",
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
    "font-display inline-flex items-center justify-center gap-2 text-[17px] font-semibold uppercase tracking-[0.08em] transition duration-200 disabled:opacity-50 [&_svg]:transition-transform hover:[&_svg]:translate-x-1",
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
