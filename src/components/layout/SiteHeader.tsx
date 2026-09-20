import {
  getFeaturedProjects,
  getPublishedServices,
  getSiteSetting,
} from "@/lib/data/content";
import { createClient } from "@/lib/supabase/server";
import type { AvailabilitySetting } from "@/lib/packages";
import { Header, type NavItem } from "@/components/layout/Header";

export async function SiteHeader() {
  const supabase = await createClient();
  const [availability, services, projects, { data: apps }] = await Promise.all([
    getSiteSetting<AvailabilitySetting>("availability"),
    getPublishedServices(),
    getFeaturedProjects(4),
    supabase
      .from("mobile_apps")
      .select("name, slug, tagline")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .limit(6),
  ]);

  const navItems: NavItem[] = [
    {
      href: "/projects",
      label: "Work",
      children: [
        ...projects.map((project) => ({
          href: `/projects/${project.slug}`,
          label: project.title,
          description: project.short_description?.slice(0, 80) || undefined,
        })),
        {
          href: "/categories",
          label: "Browse by category",
          description: "E-commerce, mobile, SaaS, and APIs",
        },
      ],
    },
    {
      href: "/services",
      label: "Services",
      children: services.map((service) => ({
        href: `/services/${service.slug}`,
        label: service.name,
        description: service.short_description ?? undefined,
      })),
    },
    {
      href: "/apps",
      label: "Apps",
      children: (apps ?? []).map((app) => ({
        href: `/apps/${app.slug}`,
        label: app.name,
        description: app.tagline ?? undefined,
      })),
    },
    { href: "/pricing", label: "Pricing" },
    {
      href: "/about",
      label: "Explore",
      children: [
        {
          href: "/industries",
          label: "Industries",
          description: "Who I build for",
        },
        {
          href: "/stack",
          label: "Stack",
          description: "Engineering toolkit",
        },
        {
          href: "/blog",
          label: "Blog",
          description: "Notes on shipping products",
        },
        {
          href: "/faq",
          label: "FAQ",
          description: "Common questions",
        },
        {
          href: "/about",
          label: "About",
          description: "Profile and approach",
        },
      ],
    },
  ];

  return <Header availability={availability} navItems={navItems} />;
}
