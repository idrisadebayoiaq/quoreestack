import { notFound } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { createClient } from "@/lib/supabase/server";
import { isAdminResource, resourceConfigs } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;
  if (!isAdminResource(resource)) notFound();
  const config = resourceConfigs[resource];
  const typed = await createClient();
  const db = typed as unknown as SupabaseClient;
  const [{ data: record }, { data: categories }, { data: services }] = await Promise.all([
    db.from(config.table).select("*").eq("id", id).maybeSingle(),
    typed.from("categories").select("id,name").order("name"),
    typed.from("services").select("id,name").order("name"),
  ]);
  if (!record) notFound();

  const [categoryLinks, serviceLinks] = await Promise.all([
    resource === "projects"
      ? typed.from("project_categories").select("category_id").eq("project_id", id)
      : resource === "services"
        ? typed.from("service_categories").select("category_id").eq("service_id", id)
        : Promise.resolve({ data: [] }),
    resource === "projects"
      ? typed.from("project_services").select("service_id").eq("project_id", id)
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div><p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Edit</p><h1 className="font-display mt-2 text-3xl">{String(record[config.nameColumn])}</h1></div>
      <ResourceForm
        resource={resource}
        config={config}
        record={record}
        categories={categories ?? []}
        services={services ?? []}
        selectedCategoryIds={(categoryLinks.data ?? []).map((link) => link.category_id)}
        selectedServiceIds={(serviceLinks.data ?? []).map((link) => link.service_id)}
      />
    </div>
  );
}
