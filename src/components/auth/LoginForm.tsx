"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues } from "@/lib/auth/schemas";
import { safeNextPath } from "@/lib/auth/safe-next";
import { NeonButton } from "@/components/ui/NeonButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          autoComplete="current-password"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[var(--bg-primary)] px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-sm)]"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-[var(--neon-magenta)]">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-sm border border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/10 px-3 py-2 text-sm text-[var(--neon-magenta)]">
          {formError}
        </p>
      ) : null}

      <NeonButton type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Login"}
      </NeonButton>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Admin access only. Public visitors can browse and download apps without signing in.
      </p>
    </form>
  );
}
