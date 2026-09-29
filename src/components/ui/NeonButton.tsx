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
    "bg-[var(--neon-cyan)] text-[var(--on-accent)] shadow-[var(--glow-sm)] hover:brightness-110",
  secondary:
    "border border-[var(--line-strong)] bg-transparent text-[var(--text-strong)] hover:border-[var(--text-strong)]",
  ghost:
    "bg-transparent px-2 text-[var(--text-strong)] underline decoration-[var(--line-strong)] underline-offset-[6px] hover:decoration-[var(--neon-cyan)]",
  danger:
    "border border-[var(--danger)]/50 bg-[var(--danger)]/10 text-[var(--danger)] hover:bg-[var(--danger)]/20",
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
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition disabled:opacity-50",
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
