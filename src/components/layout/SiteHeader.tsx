import {
  getContactChannels,
  getFeaturedProjects,
  getPublishedServices,
} from "@/lib/data/content";
import { createClient } from "@/lib/supabase/server";
import { Header, type NavItem } from "@/components/layout/Header";

export async function SiteHeader() {
  const supabase = await createClient();
  const [channels, services, projects, { data: apps }] = await Promise.all([
    getContactChannels(),
    getPublishedServices(),
    getFeaturedProjects(6),
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
      children: projects.map((project) => ({
        href: `/projects/${project.slug}`,
        label: project.title,
        description: project.short_description ?? undefined,
      })),
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
    { href: "/about", label: "About" },
    {
      href: "/industries",
      label: "More",
      children: [
        { href: "/industries", label: "Industries", description: "Who I build for" },
        { href: "/reviews", label: "Reviews", description: "What clients say" },
        { href: "/blog", label: "Blog", description: "Notes on shipping products" },
        { href: "/stack", label: "Stack", description: "Tools behind the work" },
        { href: "/faq", label: "FAQ", description: "Common questions" },
      ],
    },
  ];

  return <Header navItems={navItems} bookingUrl={channels.bookingUrl} />;
}
