"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AppWindow,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  Building2,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MessagesSquare,
  Newspaper,
  Quote,
  Settings,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/admin/actions";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/apps", label: "Apps", icon: AppWindow },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/logos", label: "Logos", icon: Building2 },
  { href: "/admin/messages", label: "Messages", icon: MessagesSquare },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/downloads", label: "Downloads", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border-glow)] bg-[#0a0e17ee] px-4 backdrop-blur md:pl-64">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="rounded border border-[var(--border-glow)] p-2 text-[var(--neon-cyan)] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <p className="font-mono-label text-xs uppercase tracking-[0.25em] text-[var(--neon-cyan)]">
          Control center
        </p>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-white">
            <Home size={15} /> <span className="hidden sm:inline">Site</span>
          </Link>
          <form action={logoutAction}>
            <button className="rounded border border-[var(--neon-magenta)] px-3 py-1.5 text-xs uppercase text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)] hover:text-black">
              Logout
            </button>
          </form>
        </div>
      </header>

      {open ? (
        <button
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-[var(--border-glow)] bg-[#0d1320] transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/admin" className="flex h-16 items-center border-b border-[var(--border-glow)] px-6">
          <span className="font-display text-lg tracking-wider text-white">
            QUORE<span className="text-[var(--neon-cyan)]">STACK</span>
          </span>
        </Link>
        <nav className="space-y-1 p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-cyan-400/10 text-[var(--neon-cyan)]"
                    : "text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-h-screen px-4 pb-12 pt-24 md:ml-64 md:px-8">{children}</main>
    </div>
  );
}
