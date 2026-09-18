"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { AdminResource, ResourceConfig } from "@/lib/admin/resources";
import { saveResourceAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { MultiImageField } from "@/components/admin/MultiImageField";

const inputClass =
  "w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14] px-3 py-2 text-sm text-white outline-none transition focus:border-[var(--neon-cyan)]";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-sm bg-[var(--neon-cyan)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

function printable(value: unknown, json = false) {
  if (value === null || value === undefined) return "";
  if (json) return JSON.stringify(value, null, 2);
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function ResourceForm({
  resource,
  config,
  record,
  categories,
  services = [],
  selectedCategoryIds = [],
  selectedServiceIds = [],
}: {
  resource: AdminResource;
  config: ResourceConfig;
  record?: Record<string, unknown>;
  categories: { id: string; name: string }[];
  services?: { id: string; name: string }[];
  selectedCategoryIds?: string[];
  selectedServiceIds?: string[];
}) {
  const [state, action] = useActionState(saveResourceAction, {});
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [clientError, setClientError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(undefined);
    setUploading(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const bucket = resource === "apps" ? "app-assets" : "project-images";
    const supabase = createClient();
    const uploadedPaths: string[] = [];

    try {
      for (const field of config.fields) {
        if (field.kind !== "image" && field.kind !== "images") continue;

        const files = data
          .getAll(field.name)
          .filter((value): value is File => value instanceof File && value.size > 0);
        const existing = String(data.get(`${field.name}_existing`) ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        const urls: string[] = [];

        for (const file of files) {
          if (!file.type.startsWith("image/")) {
            throw new Error(`${field.label} only accepts image files.`);
          }
          if (file.size > 8 * 1024 * 1024) {
            throw new Error(`${field.label} files must be 8 MB or smaller.`);
          }

          const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
          const path = `${resource}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
          const { error } = await supabase.storage.from(bucket).upload(path, file, {
            contentType: file.type,
            upsert: false,
          });
          if (error) throw error;
          uploadedPaths.push(path);
          urls.push(supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl);
        }

        data.delete(field.name);
        data.set(
          `${field.name}_existing`,
          field.kind === "image"
            ? (urls[0] ?? existing[0] ?? "")
            : [...existing, ...urls].join(","),
        );
      }

      startTransition(() => action(data));
    } catch (error) {
      if (uploadedPaths.length) {
        await supabase.storage.from(bucket).remove(uploadedPaths);
      }
      setClientError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
      <input type="hidden" name="_resource" value={resource} />
      <input type="hidden" name="_id" value={printable(record?.id)} />
      <div className="grid gap-5 lg:grid-cols-2">
        {config.fields.map((field) => {
          const value = record?.[field.name];
          const wide = ["textarea", "json", "image", "images"].includes(field.kind);
          const Wrapper = field.kind === "image" || field.kind === "images" ? "div" : "label";
          return (
            <Wrapper key={field.name} className={wide ? "lg:col-span-2" : ""}>
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {field.label}
                {field.required ? " *" : ""}
              </span>
              {field.kind === "textarea" || field.kind === "json" ? (
                <textarea
                  name={field.name}
                  defaultValue={printable(value, field.kind === "json")}
                  rows={field.kind === "json" ? 6 : 4}
                  className={inputClass}
                />
              ) : field.kind === "checkbox" ? (
                <input
                  name={field.name}
                  type="checkbox"
                  defaultChecked={Boolean(value)}
                  className="h-5 w-5 accent-cyan-400"
                />
              ) : field.kind === "status" ? (
                <select
                  name={field.name}
                  defaultValue={printable(value) || "draft"}
                  className={inputClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              ) : field.kind === "category" ? (
                <select name={field.name} defaultValue={printable(value)} className={inputClass}>
                  <option value="">None</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : field.kind === "image" || field.kind === "images" ? (
                <MultiImageField
                  name={field.name}
                  label={field.label}
                  value={value}
                  help={field.help}
                  multiple={field.kind === "images"}
                />
              ) : field.kind === "datetime" ? (
                <input
                  name={field.name}
                  type="datetime-local"
                  defaultValue={
                    value ? new Date(String(value)).toISOString().slice(0, 16) : ""
                  }
                  className={inputClass}
                />
              ) : (
                <input
                  name={field.name}
                  type={
                    field.kind === "number" ? "number" : field.kind === "url" ? "url" : "text"
                  }
                  defaultValue={printable(value)}
                  required={field.required}
                  className={inputClass}
                />
              )}
              {field.help && field.kind !== "image" && field.kind !== "images" ? (
                <small className="text-[var(--text-muted)]">{field.help}</small>
              ) : null}
            </Wrapper>
          );
        })}
      </div>
      {(resource === "projects" || resource === "services") && categories.length ? (
        <fieldset className="rounded-sm border border-[var(--border-glow)] p-4">
          <legend className="font-mono-label px-2 text-xs uppercase tracking-wider text-[var(--neon-cyan)]">
            Linked categories
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
              >
                <input
                  type="checkbox"
                  name="_category_ids"
                  value={category.id}
                  defaultChecked={selectedCategoryIds.includes(category.id)}
                  className="size-4 accent-cyan-400"
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      {resource === "projects" && services.length ? (
        <fieldset className="rounded-sm border border-[var(--border-glow)] p-4">
          <legend className="font-mono-label px-2 text-xs uppercase tracking-wider text-[var(--neon-magenta)]">
            Linked services
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <label
                key={service.id}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
              >
                <input
                  type="checkbox"
                  name="_service_ids"
                  value={service.id}
                  defaultChecked={selectedServiceIds.includes(service.id)}
                  className="size-4 accent-fuchsia-400"
                />
                {service.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      {state.error ? (
        <p className="rounded border border-red-500/50 bg-red-500/10 p-3 text-red-300">
          {state.error}
        </p>
      ) : null}
      {clientError ? (
        <p className="rounded border border-red-500/50 bg-red-500/10 p-3 text-red-300">
          {clientError}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded border border-green-500/50 bg-green-500/10 p-3 text-green-300">
          {state.success}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          disabled={uploading || pending}
          className="rounded-sm bg-[var(--neon-cyan)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-black disabled:opacity-50"
        >
          {uploading ? "Uploading…" : pending ? "Saving…" : "Save"}
        </button>
        {resource === "apps" && (state.savedId || record?.id) ? (
          <Link
            href={`/admin/apps/${String(state.savedId ?? record?.id)}/versions`}
            className="font-mono-label rounded-sm border border-[var(--neon-green)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--neon-green)] transition hover:bg-[var(--neon-green)]/10"
          >
            Choose / Upload APK
          </Link>
        ) : null}
      </div>
      {resource === "apps" && !state.savedId && !record?.id ? (
        <p className="text-xs text-[var(--text-muted)]">
          Save the app details first. The APK upload button will appear immediately afterward.
        </p>
      ) : null}
    </form>
  );
}

export { inputClass, SubmitButton };
