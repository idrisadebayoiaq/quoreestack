import { createClient } from "@/lib/supabase/server";
import { deleteSettingAction } from "@/lib/admin/actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { SettingForm } from "@/components/admin/SpecialForms";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const db = await createClient();
  const { data, error } = await db.from("site_settings").select("*").order("key");
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div><p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Configuration</p><h1 className="font-display mt-2 text-3xl">Site settings</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Values are stored as JSON. Changes may affect the public site immediately.</p></div>
      {error ? <p className="text-red-300">{error.message}</p> : null}
      <section className="grid gap-5 lg:grid-cols-2">
        {data?.map((setting) => (
          <div key={setting.id} className="relative">
            <SettingForm setting={setting} />
            <ConfirmForm action={deleteSettingAction} fields={{ _id: setting.id }} message={`Delete the "${setting.key}" setting?`} className="absolute right-4 top-5" />
          </div>
        ))}
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-[var(--neon-green)]">Add setting</p>
          <SettingForm />
        </div>
      </section>
    </div>
  );
}
