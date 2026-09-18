import Link from "next/link";
import { notFound } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { deleteResourceAction } from "@/lib/admin/actions";
import { isAdminResource, resourceConfigs } from "@/lib/admin/resources";
import { ConfirmForm } from "@/components/admin/ConfirmForm";

export const dynamic = "force-dynamic";

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  if (!isAdminResource(resource)) notFound();
  const config = resourceConfigs[resource];
  const db = (await createClient()) as unknown as SupabaseClient;
  const { data, error } = await db
    .from(config.table)
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono-label text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Content</p>
          <h1 className="font-display mt-2 text-3xl">{config.title}</h1>
        </div>
        <Link href={`/admin/${resource}/new`} className="rounded-sm bg-[var(--neon-cyan)] px-4 py-2 text-sm font-semibold text-black">
          New {config.singular}
        </Link>
      </div>
      {error ? <p className="text-red-300">{error.message}</p> : null}
      <div className="overflow-x-auto rounded-sm border border-[var(--border-glow)]">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-cyan-400/5 text-xs uppercase tracking-wider text-[var(--text-muted)]">
            <tr><th className="p-4">Name</th><th>Status</th><th>Featured</th><th>Updated</th><th className="pr-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((row: Record<string, unknown>) => (
              <tr key={String(row.id)} className="border-t border-white/5">
                <td className="p-4 font-medium text-white">{String(row[config.nameColumn] ?? "Untitled")}</td>
                <td><span className={`rounded px-2 py-1 text-xs ${row.status === "published" ? "bg-green-500/10 text-green-300" : "bg-white/5 text-[var(--text-muted)]"}`}>{String(row.status)}</span></td>
                <td>{row.featured ? "Yes" : "No"}</td>
                <td>{new Date(String(row.updated_at)).toLocaleDateString()}</td>
                <td className="pr-4">
                  <div className="flex justify-end gap-3">
                    {resource === "apps" ? <Link href={`/admin/apps/${row.id}/versions`} className="text-xs font-semibold text-[var(--neon-green)]">Upload APK</Link> : null}
                    <Link href={`/admin/${resource}/${row.id}`} className="text-xs text-[var(--neon-cyan)]">Edit</Link>
                    <ConfirmForm
                      action={deleteResourceAction}
                      fields={{ _resource: resource, _id: String(row.id) }}
                      message={`Delete this ${config.singular.toLowerCase()}? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length ? <p className="p-8 text-center text-[var(--text-muted)]">No records found.</p> : null}
      </div>
    </div>
  );
}
