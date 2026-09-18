"use server";

import { createAdminClient } from "@/lib/supabase/server";
import {
  contactSchema,
  isAllowedContactAttachment,
} from "@/lib/contact/schema";
import { notifyNewLead } from "@/lib/notify";

export type ContactActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: string;
};

function asText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function toIsoFromDatetimeLocal(value: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export async function submitContactAction(
  _previous: ContactActionState,
  form: FormData,
): Promise<ContactActionState> {
  // Honeypot
  if (asText(form, "company")) {
    return { success: "Message received. I’ll respond as soon as possible." };
  }

  const parsed = contactSchema.safeParse({
    name: asText(form, "name"),
    email: asText(form, "email"),
    subject: asText(form, "subject") || undefined,
    serviceInterest: asText(form, "serviceInterest") || undefined,
    deliveryAt: asText(form, "deliveryAt") || undefined,
    budget: asText(form, "budget") || undefined,
    message: asText(form, "message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const attachment = form.get("attachment");
  let attachmentPath: string | null = null;
  let attachmentName: string | null = null;

  const db = await createAdminClient();

  if (attachment instanceof File && attachment.size > 0) {
    if (!isAllowedContactAttachment(attachment)) {
      return {
        error: "Attachment must be PDF, image, Word, Excel, text, or ZIP under 10 MB.",
        fieldErrors: { attachment: "Invalid attachment type or size." },
      };
    }

    const extension = attachment.name.split(".").pop()?.toLowerCase() || "bin";
    const safeExt = /^[a-z0-9]{1,10}$/.test(extension) ? extension : "bin";
    attachmentPath = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
    attachmentName = attachment.name.slice(0, 255);

    const upload = await db.storage.from("contact-attachments").upload(attachmentPath, attachment, {
      contentType: attachment.type,
      upsert: false,
    });

    if (upload.error) {
      console.error("Contact attachment upload failed", upload.error);
      return { error: "Could not upload the attachment. Please retry." };
    }
  }

  const deliveryAt = toIsoFromDatetimeLocal(parsed.data.deliveryAt ?? "");

  const { error } = await db.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    service_interest: parsed.data.serviceInterest || null,
    message: parsed.data.message,
    delivery_at: deliveryAt,
    budget: parsed.data.budget || null,
    attachment_path: attachmentPath,
    attachment_name: attachmentName,
    is_read: false,
  });

  if (error) {
    console.error("Contact insert failed", error);
    if (attachmentPath) {
      await db.storage.from("contact-attachments").remove([attachmentPath]);
    }
    return { error: "Transmission failed. Please retry or contact me through social media." };
  }

  await notifyNewLead({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    serviceInterest: parsed.data.serviceInterest,
    budget: parsed.data.budget,
    message: parsed.data.message,
  });

  return { success: "Message received. I’ll respond as soon as possible." };
}
