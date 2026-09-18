import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const db = await createClient();
  const tables = [
    ["projects", "Projects"],
    ["services", "Services"],
    ["categories", "Categories"],
    ["mobile_apps", "Apps"],
    ["blogs", "Blogs"],
    ["contact_submissions", "Messages"],
    ["downloads", "Downloads"],
  ] as const;
  const counts = await Promise.all(
    tables.map(async ([table, label]) => {
      const { count } = await db.from(table).select("*", { count: "exact", head: true });
      return { label, count: count ?? 0 };
    }),
  );
  const [{ data: contacts }, { data: downloads }] = await Promise.all([
    db.from("contact_submissions").select("id,name,subject,created_at,is_read").order("created_at", { ascending: false }).limit(5),
    db.from("downloads").select("id,created_at,app_id").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="font-mono-label text-xs uppercase tracking-[0.25em] text-[var(--neon-cyan)]">System overview</p>
        <h1 className="font-display mt-2 text-3xl text-white">Dashboard</h1>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {counts.map((item) => (
          <div key={item.label} className="hud-corners rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5">
            <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
            <p className="font-display mt-2 text-3xl text-[var(--neon-cyan)]">{item.count}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Recent contacts</h2>
            <Link href="/admin/contacts" className="text-xs text-[var(--neon-cyan)]">View all</Link>
          </div>
          <div className="space-y-3">
            {contacts?.map((contact) => (
              <div key={contact.id} className="flex justify-between gap-4 border-b border-white/5 pb-3 text-sm">
                <div><p className="text-white">{contact.name}</p><p className="text-[var(--text-muted)]">{contact.subject || "No subject"}</p></div>
                {!contact.is_read ? <span className="text-xs text-[var(--neon-green)]">NEW</span> : null}
              </div>
            ))}
            {!contacts?.length ? <p className="text-sm text-[var(--text-muted)]">No messages yet.</p> : null}
          </div>
        </div>
        <div className="rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg">Recent downloads</h2>
            <Link href="/admin/downloads" className="text-xs text-[var(--neon-cyan)]">Analytics</Link>
          </div>
          <div className="space-y-3">
            {downloads?.map((download) => (
              <div key={download.id} className="flex justify-between border-b border-white/5 pb-3 text-sm">
                <span className="text-[var(--text-muted)]">App {download.app_id.slice(0, 8)}</span>
                <time>{new Date(download.created_at).toLocaleDateString()}</time>
              </div>
            ))}
            {!downloads?.length ? <p className="text-sm text-[var(--text-muted)]">No downloads yet.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
