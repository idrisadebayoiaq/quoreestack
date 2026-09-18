"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import {
  isAdminResource,
  resourceConfigs,
  type FieldKind,
} from "@/lib/admin/resources";

export type ActionState = {
  error?: string;
  success?: string;
  savedId?: string;
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_APK_SIZE = 150 * 1024 * 1024;

async function adminDb() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") throw new Error("Administrator access required.");
  return (await createAdminClient()) as unknown as SupabaseClient;
}

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function safeSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function parseField(form: FormData, name: string, kind: FieldKind) {
  const value = text(form, name);
  if (kind === "checkbox") return form.get(name) === "on";
  if (kind === "number") return value === "" ? null : Number(value);
  if (kind === "datetime") {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
  }
  if (kind === "tags") {
    return value
      ? value.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  }
  if (kind === "json") {
    if (!value) return null;
    return JSON.parse(value);
  }
  if (kind === "category") return value || null;
  return value || null;
}

async function uploadPublic(
  db: SupabaseClient,
  bucket: "project-images" | "app-assets",
  file: File,
) {
  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are allowed.");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("Images must be 8 MB or smaller.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await db.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function saveResourceAction(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    const resource = text(form, "_resource");
    const id = text(form, "_id");
    if (!isAdminResource(resource)) return { error: "Invalid resource." };
    const config = resourceConfigs[resource];
    const payload: Record<string, unknown> = {};

    for (const field of config.fields) {
      if (field.kind === "image" || field.kind === "images") continue;
      const raw = text(form, field.name);
      if (field.required && field.kind !== "checkbox" && !raw) {
        return { error: `${field.label} is required.` };
      }
      payload[field.name] = parseField(form, field.name, field.kind);
      if (field.kind === "number" && payload[field.name] !== null) {
        if (!Number.isFinite(payload[field.name])) return { error: `${field.label} is invalid.` };
      }
      if (field.kind === "url" && raw) {
        try {
          new URL(raw);
        } catch {
          return { error: `${field.label} must be a valid URL.` };
        }
      }
    }

    const slug = String(payload.slug ?? "");
    if (!safeSlug(slug)) {
      return { error: "Slug must use lowercase letters, numbers, and single hyphens." };
    }
    if (!["draft", "published", "archived"].includes(String(payload.status))) {
      return { error: "Invalid publishing status." };
    }

    const db = await adminDb();
    const bucket = resource === "apps" ? "app-assets" : "project-images";
    for (const field of config.fields) {
      if (field.kind === "image") {
        const file = form.get(field.name);
        const existing = text(form, `${field.name}_existing`);
        payload[field.name] =
          file instanceof File && file.size
            ? await uploadPublic(db, bucket, file)
            : existing || null;
      }
      if (field.kind === "images") {
        const existing = text(form, `${field.name}_existing`)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        const files = form
          .getAll(field.name)
          .filter((item): item is File => item instanceof File && item.size > 0);
        const uploaded = await Promise.all(files.map((file) => uploadPublic(db, bucket, file)));
        payload[field.name] = [...existing, ...uploaded];
      }
    }

    const query = id
      ? db.from(config.table).update(payload).eq("id", id).select("id").single()
      : db.from(config.table).insert(payload).select("id").single();
    const { data: saved, error } = await query;
    if (error || !saved?.id) return { error: error?.message ?? "Unable to save record." };

    const savedId = String(saved.id);
    const categoryIds = form
      .getAll("_category_ids")
      .filter((value): value is string => typeof value === "string" && Boolean(value));
    const serviceIds = form
      .getAll("_service_ids")
      .filter((value): value is string => typeof value === "string" && Boolean(value));

    if (resource === "projects") {
      const primaryCategory = payload.primary_category_id;
      if (
        typeof primaryCategory === "string" &&
        !categoryIds.includes(primaryCategory)
      ) {
        categoryIds.push(primaryCategory);
      }

      const clearCategories = await db
        .from("project_categories")
        .delete()
        .eq("project_id", savedId);
      if (clearCategories.error) throw clearCategories.error;
      if (categoryIds.length) {
        const linked = await db.from("project_categories").insert(
          categoryIds.map((categoryId) => ({
            project_id: savedId,
            category_id: categoryId,
          })),
        );
        if (linked.error) throw linked.error;
      }

      const clearServices = await db
        .from("project_services")
        .delete()
        .eq("project_id", savedId);
      if (clearServices.error) throw clearServices.error;
      if (serviceIds.length) {
        const linked = await db.from("project_services").insert(
          serviceIds.map((serviceId) => ({
            project_id: savedId,
            service_id: serviceId,
          })),
        );
        if (linked.error) throw linked.error;
      }
    }

    if (resource === "services") {
      const clearCategories = await db
        .from("service_categories")
        .delete()
        .eq("service_id", savedId);
      if (clearCategories.error) throw clearCategories.error;
      if (categoryIds.length) {
        const linked = await db.from("service_categories").insert(
          categoryIds.map((categoryId) => ({
            service_id: savedId,
            category_id: categoryId,
          })),
        );
        if (linked.error) throw linked.error;
      }
    }

    if (resource === "blogs" && payload.status === "published" && !payload.published_at) {
      const stamp = await db
        .from("blogs")
        .update({ published_at: new Date().toISOString() })
        .eq("id", savedId);
      if (stamp.error) throw stamp.error;
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/${resource}`);
    revalidatePath("/");
    if (resource === "blogs") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
    }
    if (resource === "projects") {
      revalidatePath("/projects");
      revalidatePath(`/projects/${slug}`);
    }
    if (resource === "services") {
      revalidatePath("/services");
      revalidatePath(`/services/${slug}`);
    }
    if (resource === "apps") {
      revalidatePath("/apps");
      revalidatePath(`/apps/${slug}`);
    }
    return {
      success: `${config.singular} saved.`,
      savedId,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save." };
  }
}

export async function deleteResourceAction(form: FormData) {
  const resource = text(form, "_resource");
  const id = text(form, "_id");
  if (!isAdminResource(resource) || !id) throw new Error("Invalid delete request.");
  const db = await adminDb();
  const apkPaths =
    resource === "apps"
      ? (
          await db
            .from("app_versions")
            .select("apk_path")
            .eq("app_id", id)
        ).data?.map((version) => String(version.apk_path)) ?? []
      : [];
  const { error } = await db.from(resourceConfigs[resource].table).delete().eq("id", id);
  if (error) throw error;
  if (apkPaths.length) {
    const cleanup = await db.storage.from("apks").remove(apkPaths);
    if (cleanup.error) {
      console.error("Deleted app but failed to remove APK files", cleanup.error);
    }
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/${resource}`);
  if (resource === "blogs") {
    revalidatePath("/");
    revalidatePath("/blog");
  }
}

export async function setContactReadAction(form: FormData) {
  const id = text(form, "_id");
  const isRead = text(form, "_read") === "true";
  const db = await adminDb();
  const { error } = await db.from("contact_submissions").update({ is_read: isRead }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/contacts");
}

export async function deleteContactAction(form: FormData) {
  const db = await adminDb();
  const id = text(form, "_id");
  const { data: contact, error: lookupError } = await db
    .from("contact_submissions")
    .select("attachment_path")
    .eq("id", id)
    .maybeSingle();
  if (lookupError) throw lookupError;

  const { error } = await db.from("contact_submissions").delete().eq("id", id);
  if (error) throw error;

  if (contact?.attachment_path) {
    const cleanup = await db.storage.from("contact-attachments").remove([contact.attachment_path]);
    if (cleanup.error) {
      console.error("Deleted contact but failed to remove attachment", cleanup.error);
    }
  }
  revalidatePath("/admin/contacts");
}

export async function getContactAttachmentUrlAction(form: FormData): Promise<ActionState> {
  try {
    const id = text(form, "_id");
    if (!id) return { error: "Missing submission id." };
    const db = await adminDb();
    const { data: contact, error } = await db
      .from("contact_submissions")
      .select("attachment_path, attachment_name")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!contact?.attachment_path) return { error: "No attachment on this submission." };

    const signed = await db.storage
      .from("contact-attachments")
      .createSignedUrl(contact.attachment_path, 60, {
        download: contact.attachment_name || undefined,
      });
    if (signed.error || !signed.data?.signedUrl) {
      return { error: signed.error?.message || "Could not create download link." };
    }
    return { success: signed.data.signedUrl };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Download failed." };
  }
}

export async function createVersionAction(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    const appId = text(form, "_app_id");
    const version = text(form, "version");
    const code = Number(text(form, "version_code"));
    const apk = form.get("apk");
    if (!appId || !version || !Number.isInteger(code) || code < 1) {
      return { error: "App, version, and a positive version code are required." };
    }
    if (!(apk instanceof File) || !apk.size) return { error: "Select an APK file." };
    if (apk.size > MAX_APK_SIZE) return { error: "APK must be 500 MB or smaller." };
    if (!apk.name.toLowerCase().endsWith(".apk")) return { error: "File must use the .apk extension." };

    const db = await adminDb();
    const path = `${appId}/${Date.now()}-${apk.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await db.storage.from("apks").upload(path, apk, {
      contentType: apk.type || "application/vnd.android.package-archive",
    });
    if (upload.error) throw upload.error;
    const latest = form.get("is_latest") === "on";
    const inserted = await db
      .from("app_versions")
      .insert({
        app_id: appId,
        version,
        version_code: code,
        changelog: text(form, "changelog") || null,
        apk_path: path,
        file_size_bytes: apk.size,
        is_latest: latest,
      })
      .select("id")
      .single();
    if (inserted.error) {
      await db.storage.from("apks").remove([path]);
      throw inserted.error;
    }
    if (latest) {
      const { error } = await db
        .from("app_versions")
        .update({ is_latest: false })
        .eq("app_id", appId)
        .neq("id", inserted.data.id);
      if (error) throw error;
    }
    revalidatePath(`/admin/apps/${appId}/versions`);
    return { success: "Version uploaded." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed." };
  }
}

export async function setLatestVersionAction(form: FormData) {
  const appId = text(form, "_app_id");
  const id = text(form, "_id");
  const db = await adminDb();
  // The database trigger clears the previous latest release in the same
  // transaction before this row is updated.
  const result = await db
    .from("app_versions")
    .update({ is_latest: true })
    .eq("id", id)
    .eq("app_id", appId);
  if (result.error) throw result.error;
  revalidatePath(`/admin/apps/${appId}/versions`);
}

export async function deleteVersionAction(form: FormData) {
  const appId = text(form, "_app_id");
  const id = text(form, "_id");
  const db = await adminDb();
  const { data: version, error: readError } = await db
    .from("app_versions")
    .select("apk_path")
    .eq("id", id)
    .eq("app_id", appId)
    .maybeSingle();
  if (readError) throw readError;
  const { error } = await db.from("app_versions").delete().eq("id", id).eq("app_id", appId);
  if (error) throw error;
  if (version?.apk_path) await db.storage.from("apks").remove([version.apk_path]);
  revalidatePath(`/admin/apps/${appId}/versions`);
}

export async function saveSettingAction(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  try {
    const id = text(form, "_id");
    const key = text(form, "key");
    const raw = text(form, "value");
    if (!key) return { error: "A setting key is required." };
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      return { error: "Value must be valid JSON." };
    }
    const db = await adminDb();
    const { error } = id
      ? await db.from("site_settings").update({ key, value }).eq("id", id)
      : await db.from("site_settings").insert({ key, value });
    if (error) return { error: error.message };
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/start");
    revalidatePath("/services");
    return { success: "Setting saved." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save setting." };
  }
}

export async function deleteSettingAction(form: FormData) {
  const db = await adminDb();
  const { error } = await db.from("site_settings").delete().eq("id", text(form, "_id"));
  if (error) throw error;
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
