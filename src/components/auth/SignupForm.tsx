"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupValues } from "@/lib/auth/schemas";
import { safeNextPath } from "@/lib/auth/safe-next";
import { NeonButton } from "@/components/ui/NeonButton";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupValues) => {
    setFormError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.session) {
      router.push(next);
      router.refresh();
      return;
    }

    setInfo(
      "Account created. Check your email to confirm, then log in. (If confirmations are disabled in Supabase, you can log in immediately.)",
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="font-mono-label mb-1.5 block text-xs uppercase tracking-wider text-[var(--text-muted)]"
        >
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-sm)]"
          {...register("fullName")}
        />
        {errors.fullName ? (
          <p className="mt-1 text-sm text-[var(--neon-magenta)]">
            {errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="font-mono-label mb-1.5 block text-xs uppercase tracking-wider text-[var(--text-muted)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-sm)]"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-[var(--neon-magenta)]">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="font-mono-label mb-1.5 block text-xs uppercase tracking-wider text-[var(--text-muted)]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-sm)]"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-[var(--neon-magenta)]">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="font-mono-label mb-1.5 block text-xs uppercase tracking-wider text-[var(--text-muted)]"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-sm)]"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-[var(--neon-magenta)]">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-sm border border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/10 px-3 py-2 text-sm text-[var(--neon-magenta)]">
          {formError}
        </p>
      ) : null}

      {info ? (
        <p className="rounded-sm border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 px-3 py-2 text-sm text-[var(--neon-cyan)]">
          {info}
        </p>
      ) : null}

      <NeonButton type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Sign up"}
      </NeonButton>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Already registered?{" "}
        <Link
          href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-[var(--neon-cyan)] hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
