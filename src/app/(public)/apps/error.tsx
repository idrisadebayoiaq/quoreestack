"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AppsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto grid min-h-[65vh] max-w-3xl place-items-center px-4 py-20 text-center md:px-6">
      <div className="hud-corners w-full border border-[var(--neon-magenta)]/35 bg-[var(--bg-glass)] p-10 backdrop-blur-md">
        <AlertTriangle className="mx-auto size-10 text-[var(--neon-magenta)]" />
        <p className="font-mono-label mt-6 text-xs uppercase tracking-[0.3em] text-[var(--neon-magenta)]">
          Registry connection interrupted
        </p>
        <h1 className="font-display mt-3 text-3xl text-white">
          Apps are temporarily offline
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[var(--text-muted)]">
          The release catalog could not be loaded. Reconnect to retry the secure
          app registry.
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-mono-label mt-8 inline-flex items-center gap-2 rounded-sm border border-[var(--neon-cyan)] px-5 py-3 text-xs uppercase tracking-wider text-[var(--neon-cyan)] transition hover:bg-[var(--neon-cyan)]/10"
        >
          <RotateCcw className="size-4" /> Retry connection
        </button>
      </div>
    </main>
  );
}
