"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { siteConfig, cn } from "@/lib/utils";
import { NeonButton } from "@/components/ui/NeonButton";
import type { AvailabilitySetting } from "@/lib/packages";

export type NavChild = { href: string; label: string; description?: string };

export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

const SUBMENU_PREVIEW = 3;

export function Header({
  availability,
  navItems,
}: {
  availability?: AvailabilitySetting | null;
  navItems: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
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
          {navItems.map((item) => {
            if (!item.children?.length) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="hover"
                  className="font-mono-label px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
                >
                  {item.label}
                </Link>
              );
            }

            const preview = item.children.slice(0, SUBMENU_PREVIEW);
            const hasMore = item.children.length > SUBMENU_PREVIEW;

            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  data-cursor="hover"
                  className="font-mono-label inline-flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
                >
                  {item.label}
                  <ChevronDown className="size-3.5 opacity-70 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 min-w-[18rem] translate-y-2 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="rounded-sm border border-[var(--border-glow)] bg-[var(--bg-secondary)]/95 p-2 shadow-[var(--glow-sm)] backdrop-blur-xl">
                    {preview.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        data-cursor="hover"
                        className="block rounded-sm px-3 py-2.5 transition hover:bg-[var(--neon-cyan)]/10"
                      >
                        <span className="font-mono-label text-xs uppercase tracking-wider text-white">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                    {hasMore ? (
                      <Link
                        href={item.href}
                        className="font-mono-label mt-1 block border-t border-white/5 px-3 py-2.5 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]"
                      >
                        See all →
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
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
          className="text-[var(--neon-cyan)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
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
          {navItems.map((item) => {
            if (!item.children?.length) {
              return (
                <div key={item.href} className="border-b border-white/5">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-mono-label block py-3 text-sm uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            }

            const preview = item.children.slice(0, SUBMENU_PREVIEW);
            const hasMore = item.children.length > SUBMENU_PREVIEW;

            return (
              <div key={item.href} className="border-b border-white/5">
                <button
                  type="button"
                  className="font-mono-label flex w-full items-center justify-between py-3 text-sm uppercase tracking-wider text-[var(--text-muted)]"
                  onClick={() =>
                    setMobileOpen((current) =>
                      current === item.href ? null : item.href,
                    )
                  }
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition",
                      mobileOpen === item.href && "rotate-180",
                    )}
                  />
                </button>
                {mobileOpen === item.href ? (
                  <div className="space-y-1 pb-3 pl-2">
                    {preview.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                    {hasMore ? (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm text-[var(--neon-cyan)]"
                      >
                        See all
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
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
