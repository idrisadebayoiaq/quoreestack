"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig, cn } from "@/lib/utils";
import { NeonButton } from "@/components/ui/NeonButton";
import type { AvailabilitySetting } from "@/lib/packages";

const navLinks = [
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/apps", label: "Apps" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Header({
  availability,
}: {
  availability?: AvailabilitySetting | null;
}) {
  const [open, setOpen] = useState(false);
  const status = availability?.status ?? "open";
  const openForWork = status === "open" || status === "limited";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-glow)]/40 bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          data-cursor="hover"
          className="group flex shrink-0 items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center border border-[var(--neon-cyan)]/50 font-display text-xs font-bold text-[var(--neon-cyan)] shadow-[var(--glow-sm)]">
            QS
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-white group-hover:text-[var(--neon-cyan)]">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="hover"
              className="font-mono-label px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
            >
              {link.label}
            </Link>
          ))}
          {openForWork ? (
            <span className="ml-2 hidden items-center gap-2 font-mono-label text-[10px] uppercase tracking-wider text-[var(--neon-green)] xl:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neon-green)]" />
              {availability?.label ?? "Available"}
            </span>
          ) : null}
          <NeonButton href="/start" className="ml-2 !py-1.5 !text-xs">
            Start a project
          </NeonButton>
        </nav>

        <button
          type="button"
          className="lg:hidden text-[var(--neon-cyan)]"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-[var(--border-glow)]/40 bg-[var(--bg-secondary)] lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono-label border-b border-white/5 py-3 text-sm uppercase tracking-wider text-[var(--text-muted)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/start"
            onClick={() => setOpen(false)}
            className="font-mono-label mt-3 rounded-sm bg-[var(--neon-cyan)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[var(--bg-primary)]"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
