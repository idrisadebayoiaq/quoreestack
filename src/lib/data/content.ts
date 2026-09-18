import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type Project = Tables<"projects">;
export type Service = Tables<"services">;
export type Category = Tables<"categories">;
export type Blog = Tables<"blogs">;
export type Testimonial = Tables<"testimonials">;
export type ClientLogo = Tables<"client_logos">;

export async function getPublishedProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getFeaturedProjects(limit = 3) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getPublishedServices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getFeaturedServices(limit = 4) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getPublishedBlogs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getFeaturedBlogs(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getFeaturedTestimonials(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getPublishedClientLogos(limit = 12) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("client_logos")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getPublishedCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSiteSetting<T = Record<string, unknown>>(key: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as T | undefined) ?? undefined;
}

export async function getContentCounts() {
  const supabase = await createClient();
  const [projects, services, categories, apps, blogs] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("categories")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("mobile_apps")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("blogs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  return {
    projects: projects.count ?? 0,
    services: services.count ?? 0,
    categories: categories.count ?? 0,
    apps: apps.count ?? 0,
    blogs: blogs.count ?? 0,
  };
}
