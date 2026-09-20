"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notify";

export type ReviewActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: string;
};

const reviewSchema = z.object({
  author_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  author_title: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  quote: z.string().trim().min(20).max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  image_url: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

function asText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function submitReviewAction(
  _previous: ReviewActionState,
  form: FormData,
): Promise<ReviewActionState> {
  // Honeypot
  if (asText(form, "website")) {
    return {
      success: "Thanks — your review was received and will appear after approval.",
    };
  }

  const parsed = reviewSchema.safeParse({
    author_name: asText(form, "author_name"),
    email: asText(form, "email"),
    author_title: asText(form, "author_title") || undefined,
    company: asText(form, "company") || undefined,
    quote: asText(form, "quote"),
    rating: asText(form, "rating") || "5",
    image_url: asText(form, "image_url") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  const baseSlug = slugify(`${data.author_name}-${data.company ?? "client"}`) || "review";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(data.author_name)}&backgroundColor=0c1220&textColor=3d8bff`;

  const db = await createAdminClient();
  const { error } = await db.from("testimonials").insert({
    slug,
    author_name: data.author_name,
    author_title: data.author_title ?? null,
    company: data.company ?? null,
    quote: data.quote,
    avatar_url: avatarUrl,
    image_url: data.image_url ?? null,
    rating: data.rating,
    email: data.email,
    source: "public",
    status: "draft",
    featured: false,
    sort_order: 999,
  });

  if (error) {
    return { error: "Could not save your review. Please try again shortly." };
  }

  await notifyNewLead({
    name: data.author_name,
    email: data.email,
    subject: "New client review submitted",
    message: `${data.rating}/5 — ${data.quote}\n\nCompany: ${data.company ?? "—"}\nRole: ${data.author_title ?? "—"}`,
    serviceInterest: "testimonial",
  });

  return {
    success:
      "Thanks — your review was received. It will appear publicly after I approve it.",
  };
}
