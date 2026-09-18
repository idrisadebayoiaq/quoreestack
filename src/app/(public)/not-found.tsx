import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";

export default function PublicNotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-4xl place-items-center px-4 py-24 text-center">
      <div>
        <Radar className="mx-auto size-14 text-[var(--neon-cyan)]" />
        <p className="font-mono-label mt-6 text-xs uppercase tracking-[0.4em] text-[var(--neon-magenta)]">
          Error 404 · Signal lost
        </p>
        <h1 className="font-display mt-4 text-4xl text-white md:text-6xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-[var(--text-muted)]">
          The requested route does not exist, was removed, or is not currently
          published.
        </p>
        <Link
          href="/"
          className="font-mono-label mt-9 inline-flex items-center gap-2 border border-[var(--neon-cyan)] px-5 py-3 text-xs uppercase tracking-wider text-[var(--neon-cyan)] transition hover:bg-[var(--neon-cyan)] hover:text-black"
        >
          <ArrowLeft className="size-4" /> Return home
        </Link>
      </div>
    </main>
  );
}
