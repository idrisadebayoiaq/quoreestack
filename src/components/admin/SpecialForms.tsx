"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSettingAction } from "@/lib/admin/actions";
import { inputClass, SubmitButton } from "@/components/admin/ResourceForm";
import { createClient } from "@/lib/supabase/client";

function Notice({ state }: { state: { error?: string; success?: string } }) {
  if (state.error) return <p className="text-sm text-red-300">{state.error}</p>;
  if (state.success) return <p className="text-sm text-green-300">{state.success}</p>;
  return null;
}

export function VersionForm({ appId }: { appId: string }) {
  const router = useRouter();
  const [state, setState] = useState<{ error?: string; success?: string }>({});
  const [uploading, setUploading] = useState(false);

  async function uploadVersion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setState({});

    const form = event.currentTarget;
    const data = new FormData(form);
    const apk = data.get("apk");
    const version = String(data.get("version") ?? "").trim();
    const versionCode = Number(data.get("version_code"));
    const isLatest = data.get("is_latest") === "on";

    try {
      if (!(apk instanceof File) || !apk.size) throw new Error("Select an APK file.");
      if (!apk.name.toLowerCase().endsWith(".apk")) {
        throw new Error("File must use the .apk extension.");
      }
      if (apk.size > 150 * 1024 * 1024) {
        throw new Error("APK must be 150 MB or smaller.");
      }
      if (!version || !Number.isInteger(versionCode) || versionCode < 1) {
        throw new Error("Enter a version and positive version code.");
      }

      const supabase = createClient();
      const path = `${appId}/${Date.now()}-${apk.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("apks")
        .upload(path, apk, {
          contentType: apk.type || "application/vnd.android.package-archive",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("app_versions").insert({
        app_id: appId,
        version,
        version_code: versionCode,
        apk_path: path,
        file_size_bytes: apk.size,
        changelog: String(data.get("changelog") ?? "").trim() || null,
        is_latest: isLatest,
      });
      if (insertError) {
        await supabase.storage.from("apks").remove([path]);
        throw insertError;
      }

      form.reset();
      setState({ success: "Version uploaded." });
      router.refresh();
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : "Upload failed.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={uploadVersion} encType="multipart/form-data" className="grid gap-4 rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-5 md:grid-cols-2">
      <input type="hidden" name="_app_id" value={appId} />
      <label>
        <span className="mb-1 block text-xs uppercase text-[var(--text-muted)]">Version *</span>
        <input name="version" required className={inputClass} placeholder="1.2.0" />
      </label>
      <label>
        <span className="mb-1 block text-xs uppercase text-[var(--text-muted)]">Version code *</span>
        <input name="version_code" type="number" min="1" required className={inputClass} />
      </label>
      <label className="md:col-span-2">
        <span className="mb-1 block text-xs uppercase text-[var(--text-muted)]">APK (max 150 MB) *</span>
        <input name="apk" type="file" accept=".apk,application/vnd.android.package-archive" required className={inputClass} />
      </label>
      <label className="md:col-span-2">
        <span className="mb-1 block text-xs uppercase text-[var(--text-muted)]">Changelog</span>
        <textarea name="changelog" rows={4} className={inputClass} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="is_latest" type="checkbox" defaultChecked className="h-5 w-5 accent-cyan-400" />
        Set as latest
      </label>
      <div className="md:col-span-2"><Notice state={state} /></div>
      <div className="md:col-span-2">
        <button
          disabled={uploading}
          className="rounded-sm bg-[var(--neon-cyan)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload version"}
        </button>
      </div>
    </form>
  );
}

export function SettingForm({
  setting,
}: {
  setting?: { id: string; key: string; value: unknown };
}) {
  const [state, action] = useActionState(saveSettingAction, {});
  return (
    <form action={action} className="space-y-3 rounded-sm border border-[var(--border-glow)] bg-[var(--bg-glass)] p-4">
      <input type="hidden" name="_id" value={setting?.id ?? ""} />
      <input name="key" required defaultValue={setting?.key} placeholder="setting_key" className={inputClass} />
      <textarea
        name="value"
        required
        rows={5}
        defaultValue={setting ? JSON.stringify(setting.value, null, 2) : ""}
        placeholder='{"enabled": true}'
        className={inputClass}
      />
      <Notice state={state} />
      <SubmitButton />
    </form>
  );
}
