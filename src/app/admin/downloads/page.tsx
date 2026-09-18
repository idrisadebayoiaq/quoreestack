import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const db = await createClient();
  const [{ count }, { data, error }] = await Promise.all([
    db.from("downloads").select("*", { count: "exact", head: true }),
    db.from("downloads")
      .select("id,created_at,user_id,app_id,mobile_apps(name),app_versions(version)")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);
  const rows = data ?? [];
  const since = Date.now() - 30 * 86400000;
  const recent = rows.filter((row) => new Date(row.created_at).getTime() >= since).length;
  const users = new Set(rows.map((row) => row.user_id)).size;
  const byApp = rows.reduce<Record<string, { name: string; count: number }>>((acc, row) => {
    const current = acc[row.app_id] ?? { name: row.mobile_apps?.name ?? row.app_id.slice(0, 8), count: 0 };
    current.count += 1;
    acc[row.app_id] = current;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div><p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Analytics</p><h1 className="font-display mt-2 text-3xl">Downloads</h1></div>
      <section className="grid gap-4 sm:grid-cols-3">
        {[["All time", count ?? 0], ["Last 30 days", recent], ["Users (latest 200)", users]].map(([label, value]) => (
          <div key={label} className="rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5"><p className="text-sm text-[var(--text-muted)]">{label}</p><p className="font-display mt-2 text-3xl text-[var(--neon-cyan)]">{value}</p></div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-sm border border-[var(--border-glow)] p-5">
          <h2 className="font-display mb-4 text-lg">By app (latest 200)</h2>
          <div className="space-y-3">{Object.entries(byApp).sort((a, b) => b[1].count - a[1].count).map(([id, app]) => <div key={id} className="flex justify-between border-b border-white/5 pb-2 text-sm"><span>{app.name}</span><span className="text-[var(--neon-cyan)]">{app.count}</span></div>)}</div>
        </div>
        <div className="overflow-x-auto rounded-sm border border-[var(--border-glow)]">
          {error ? <p className="p-4 text-red-300">{error.message}</p> : null}
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-cyan-400/5 text-xs uppercase text-[var(--text-muted)]"><tr><th className="p-4">App</th><th>Version</th><th>User</th><th>Date</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id} className="border-t border-white/5"><td className="p-4">{row.mobile_apps?.name ?? row.app_id.slice(0, 8)}</td><td>{row.app_versions?.version ?? "—"}</td><td>{row.user_id ? row.user_id.slice(0, 8) : "Guest"}</td><td>{new Date(row.created_at).toLocaleString()}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
