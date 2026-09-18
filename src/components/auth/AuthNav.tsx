"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type ProfileRole = "user" | "admin" | null;

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<ProfileRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user: current },
      } = await supabase.auth.getUser();
      setUser(current);

      if (current) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", current.id)
          .maybeSingle();
        setRole(profile?.role ?? "user");
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setRole(null);
      } else {
        void supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data }) => setRole(data?.role ?? "user"));
      }
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <span className="font-mono-label text-[10px] uppercase tracking-wider text-[var(--text-muted)]/60">
        …
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login?next=/admin"
        data-cursor="hover"
        className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]/70 transition hover:text-[var(--neon-cyan)]"
      >
        Admin login
      </Link>
    );
  }

  if (role !== "admin") {
    return (
      <button
        type="button"
        onClick={signOut}
        className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]/70 transition hover:text-[var(--neon-cyan)]"
      >
        Sign out
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/admin"
        data-cursor="hover"
        className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--neon-green)]/90 transition hover:text-[var(--neon-green)]"
      >
        Admin
      </Link>
      <Link
        href="/admin/messages"
        data-cursor="hover"
        className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]/70 transition hover:text-[var(--neon-cyan)]"
      >
        Messages
      </Link>
      <button
        type="button"
        onClick={signOut}
        className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]/70 transition hover:text-[var(--neon-cyan)]"
      >
        Logout
      </button>
    </div>
  );
}
