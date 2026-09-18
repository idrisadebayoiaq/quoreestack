import { Suspense } from "react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <GlowCard className="w-full">
      <h1 className="font-display mb-2 text-2xl font-bold text-white">
        Sign up
      </h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        Optional account creation. Apps can be browsed and downloaded without signing up.
      </p>
      <Suspense
        fallback={
          <p className="font-mono-label text-sm text-[var(--text-muted)]">
            Loading…
          </p>
        }
      >
        <SignupForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        <Link href="/" className="text-[var(--neon-cyan)] hover:underline">
          ← Back home
        </Link>
      </p>
    </GlowCard>
  );
}
