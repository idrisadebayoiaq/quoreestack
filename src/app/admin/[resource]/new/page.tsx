import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { createClient } from "@/lib/supabase/server";
import { isAdminResource, resourceConfigs } from "@/lib/admin/resources";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  if (!isAdminResource(resource)) notFound();
  const db = await createClient();
  const [{ data: categories }, { data: services }] = await Promise.all([
    db.from("categories").select("id,name").order("name"),
    db.from("services").select("id,name").order("name"),
  ]);
  const config = resourceConfigs[resource];
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div><p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Create</p><h1 className="font-display mt-2 text-3xl">New {config.singular}</h1></div>
      <ResourceForm
        resource={resource}
        config={config}
        categories={categories ?? []}
        services={services ?? []}
      />
    </div>
  );
}
