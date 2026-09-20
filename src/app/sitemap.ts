import type { MetadataRoute } from "next";
import { processSteps } from "@/lib/process";
import { createStaticClient } from "@/lib/supabase/static";
import { siteConfig } from "@/lib/utils";

const routes = [
  "",
  "/about",
  "/projects",
  "/services",
  "/blog",
  "/categories",
  "/apps",
  "/contact",
  "/start",
  "/portal",
  "/pricing",
  "/faq",
  "/industries",
  "/stack",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: (route === "" || route === "/blog" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: route === "" ? 1 : route === "/contact" || route === "/start" ? 0.9 : 0.8,
  }));

  const processPages = processSteps.map((step) => ({
    url: `${siteConfig.url}/process/${step.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createStaticClient();
    const [blogs, projects, services, categories, apps] = await Promise.all([
      supabase.from("blogs").select("slug, updated_at").eq("status", "published"),
      supabase.from("projects").select("slug, updated_at").eq("status", "published"),
      supabase.from("services").select("slug, updated_at").eq("status", "published"),
      supabase.from("categories").select("slug, updated_at").eq("status", "published"),
      supabase.from("mobile_apps").select("slug, updated_at").eq("status", "published"),
    ]);

    const mapRows = (
      rows: { slug: string; updated_at: string | null }[] | null,
      prefix: string,
      priority = 0.7,
    ) =>
      (rows ?? []).map((row) => ({
        url: `${siteConfig.url}${prefix}/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority,
      }));

    dynamicPages = [
      ...mapRows(blogs.data, "/blog"),
      ...mapRows(projects.data, "/projects", 0.75),
      ...mapRows(services.data, "/services", 0.75),
      ...mapRows(categories.data, "/categories", 0.65),
      ...mapRows(apps.data, "/apps", 0.75),
    ];
  } catch {
    dynamicPages = [];
  }

  return [...pages, ...processPages, ...dynamicPages];
}
