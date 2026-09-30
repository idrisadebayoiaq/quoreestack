"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { siteConfig, cn } from "@/lib/utils";
import { NeonButton } from "@/components/ui/NeonButton";
import { Wordmark } from "@/components/ui/Wordmark";

export type NavChild = { href: string; label: string; description?: string };

export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

const SUBMENU_PREVIEW = 5;

export function Header({
  navItems,
  bookingUrl,
}: {
  navItems: NavItem[];
  bookingUrl?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
    <div className="relative z-50 border-b border-[var(--line)] bg-[#0a0c0e]">
      <div className="font-mono-label mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[11px] uppercase text-[var(--steel)] md:px-6">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--neon-cyan)]" />
          Full stack developer · Osogbo, Nigeria
        </span>
        <span className="hidden sm:inline">
          Web <b className="font-normal text-[var(--neon-cyan)]">/</b> Android{" "}
          <b className="font-normal text-[var(--neon-cyan)]">/</b> Backend
        </span>
      </div>
    </div>
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg-primary)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} home`}>
          <Wordmark spin className="text-[1.7rem]" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const linkClass = cn(
              "font-display relative inline-flex items-center gap-1 px-3 py-2 text-[17px] !font-medium tracking-[0.1em] transition after:absolute after:bottom-0 after:left-3 after:h-0.5 after:bg-[var(--neon-cyan)] after:transition-all after:duration-300",
              active
                ? "text-[var(--text-strong)] after:w-[calc(100%-1.5rem)]"
                : "text-[var(--text-muted)] after:w-0 hover:text-[var(--text-strong)] hover:after:w-[calc(100%-1.5rem)]",
            );

            if (!item.children?.length) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              );
            }

            const preview = item.children.slice(0, SUBMENU_PREVIEW);
            const hasMore = item.children.length > SUBMENU_PREVIEW;

            return (
              <div key={item.label} className="group relative">
                <Link href={item.href} className={linkClass}>
                  {item.label}
                  <ChevronDown className="size-3.5 opacity-60 transition group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 min-w-[14rem] translate-y-1 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-secondary)] p-2 shadow-[var(--glow-md)]">
                    {preview.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-3 py-2.5 transition hover:bg-[var(--bg-primary)]"
                      >
                        <span className="block text-[15px] font-semibold text-[var(--text-strong)]">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="mt-0.5 line-clamp-1 block text-sm text-[var(--text-muted)]">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                    {hasMore ? (
                      <Link
                        href={item.href}
                        className="mt-1 block border-t border-[var(--line)] px-3 pb-1.5 pt-3 text-sm font-semibold text-[var(--neon-cyan)]"
                      >
                        See all
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {bookingUrl ? (
            <NeonButton href={bookingUrl} variant="ghost" className="!py-2 text-sm">
              Book a call
            </NeonButton>
          ) : null}
          <NeonButton href="/start" className="!py-2 text-sm">
            Start a project
          </NeonButton>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center border border-[var(--line)] text-[var(--text-strong)] transition hover:border-[var(--neon-cyan)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[var(--line)] bg-[var(--bg-primary)] lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col px-4 py-3">
          {navItems.map((item) => {
            if (!item.children?.length) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-display border-b border-[var(--line)] py-3.5 text-xl !font-semibold tracking-[0.08em] text-[var(--text-strong)]"
                >
                  {item.label}
                </Link>
              );
            }

            const expanded = mobileOpen === item.label;
            return (
              <div key={item.label} className="border-b border-[var(--line)]">
                <button
                  type="button"
                  aria-expanded={expanded}
                  className="font-display flex w-full items-center justify-between py-3.5 text-xl !font-semibold tracking-[0.08em] text-[var(--text-strong)]"
                  onClick={() => setMobileOpen(expanded ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={cn("size-4 transition", expanded && "rotate-180")} />
                </button>
                {expanded ? (
                  <div className="space-y-1 pb-3 pl-1">
                    <Link
                      href={item.href}
                      className="block py-2 text-[15px] font-semibold text-[var(--neon-cyan)]"
                    >
                      All {item.label.toLowerCase()}
                    </Link>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-[15px] text-[var(--text-body)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className="mt-5 grid gap-3 pb-4">
            <NeonButton href="/start">Start a project</NeonButton>
            {bookingUrl ? (
              <NeonButton href={bookingUrl} variant="secondary">
                Book a 20-min call
              </NeonButton>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
    </>
  );
}
