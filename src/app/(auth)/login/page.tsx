import { Suspense } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const isAdmin = Boolean(next?.startsWith("/admin"));
  const isPortal = Boolean(next?.includes("/messages") || next === "/portal");

  const title = isAdmin ? "Admin login" : isPortal ? "Client portal" : "Sign in";
  const description = isAdmin
    ? "Sign in to manage QuoreStack content, apps, and messages."
    : isPortal
      ? "Sign in to view project messages and updates."
      : "Sign in to continue.";

  return (
    <GlowCard className="w-full">
      <h1 className="font-display mb-2 text-2xl font-bold text-white">{title}</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">{description}</p>
      <Suspense
        fallback={
          <p className="font-mono-label text-sm text-[var(--text-muted)]">
            Loading…
          </p>
        }
      >
        <LoginForm />
      </Suspense>
      {!isAdmin ? (
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          New here?{" "}
          <Link href="/signup" className="text-[var(--neon-cyan)] hover:underline">
            Create a client account
          </Link>
        </p>
      ) : null}
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        <Link href="/" className="text-[var(--neon-cyan)] hover:underline">
          ← Back home
        </Link>
      </p>
    </GlowCard>
  );
}
