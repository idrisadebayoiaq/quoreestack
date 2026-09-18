import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteVersionAction, setLatestVersionAction } from "@/lib/admin/actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { VersionForm } from "@/components/admin/SpecialForms";

export const dynamic = "force-dynamic";

export default async function VersionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createClient();
  const [{ data: app }, { data: versions }] = await Promise.all([
    db.from("mobile_apps").select("id,name").eq("id", id).maybeSingle(),
    db
      .from("app_versions")
      .select("id,app_id,version,version_code,file_size_bytes,changelog,is_latest,created_at")
      .eq("app_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (!app) notFound();
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div><p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">APK releases</p><h1 className="font-display mt-2 text-3xl">{app.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
          Prefer pasting your{" "}
          <a href={`/admin/apps/${id}`} className="text-[var(--neon-cyan)] hover:underline">
            Expo / EAS build download URL
          </a>{" "}
          on the app (Builds → Install/Download). Upload here only if you want the APK hosted in Supabase.
        </p>
      </div>
      <VersionForm appId={id} />
      <section className="space-y-3">
        <h2 className="font-display text-xl">Release history</h2>
        {versions?.map((version) => (
          <div key={version.id} className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-4">
            <div>
              <p className="font-medium text-white">v{version.version} <span className="text-xs text-[var(--text-muted)]">({version.version_code ?? "—"})</span></p>
              <p className="text-xs text-[var(--text-muted)]">{version.file_size_bytes ? `${(version.file_size_bytes / 1048576).toFixed(1)} MB` : "Size unknown"} · {new Date(version.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              {version.is_latest ? <span className="text-xs text-[var(--neon-green)]">LATEST</span> : (
                <form action={setLatestVersionAction}>
                  <input type="hidden" name="_app_id" value={id} /><input type="hidden" name="_id" value={version.id} />
                  <button className="text-xs text-[var(--neon-cyan)]">Set latest</button>
                </form>
              )}
              <ConfirmForm action={deleteVersionAction} fields={{ _app_id: id, _id: version.id }} message="Delete this version and its APK? This cannot be undone." />
            </div>
          </div>
        ))}
        {!versions?.length ? <p className="text-[var(--text-muted)]">No APK versions uploaded.</p> : null}
      </section>
    </div>
  );
}
