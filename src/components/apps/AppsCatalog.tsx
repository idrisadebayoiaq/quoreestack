"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppCard } from "./AppCard";
import type { PublicApp } from "./types";

type Filter = "all" | "featured" | string;

export function AppsCatalog({ apps }: { apps: PublicApp[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const technologies = useMemo(
    () =>
      Array.from(
        new Set(apps.flatMap((app) => app.tech_stack ?? []).filter(Boolean)),
      )
        .sort()
        .slice(0, 6),
    [apps],
  );

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apps.filter((app) => {
      const searchable = [
        app.name,
        app.tagline,
        app.short_description,
        ...(app.tech_stack ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      const matchesFilter =
        filter === "all" ||
        (filter === "featured" && app.featured) ||
        app.tech_stack?.includes(filter);

      return matchesQuery && matchesFilter;
    });
  }, [apps, filter, query]);

  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-4 backdrop-blur-md md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search apps</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--neon-cyan)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps, features, or technology..."
            className="w-full rounded-sm border border-[var(--border-glow)] bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)]"
          />
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:max-w-xl">
          <SlidersHorizontal className="mr-1 size-4 shrink-0 text-[var(--text-muted)]" />
          {["all", "featured", ...technologies].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`font-mono-label shrink-0 rounded-sm border px-3 py-2 text-[10px] uppercase tracking-wider transition ${
                filter === item
                  ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                  : "border-[var(--border-glow)] text-[var(--text-muted)] hover:border-white/30 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono-label text-xs uppercase tracking-wider text-[var(--text-muted)]">
          {filteredApps.length} {filteredApps.length === 1 ? "app" : "apps"} online
        </p>
        {(query || filter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="font-mono-label text-xs uppercase tracking-wider text-[var(--neon-cyan)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredApps.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="hud-corners border border-dashed border-[var(--border-glow)] px-6 py-16 text-center">
          <p className="font-display text-xl text-white">No matching apps</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Try a different search phrase or reset the active filter.
          </p>
        </div>
      )}
    </div>
  );
}
