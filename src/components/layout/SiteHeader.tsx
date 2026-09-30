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
      .select("name, slug")
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
      })),
    },
    {
      href: "/services",
      label: "Services",
      children: services.map((service) => ({
        href: `/services/${service.slug}`,
        label: service.name,
      })),
    },
    {
      href: "/apps",
      label: "Apps",
      children: (apps ?? []).map((app) => ({
        href: `/apps/${app.slug}`,
        label: app.name,
      })),
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    {
      href: "/industries",
      label: "More",
      children: [
        { href: "/industries", label: "Industries" },
        { href: "/reviews", label: "Reviews" },
        { href: "/blog", label: "Blog" },
        { href: "/stack", label: "Stack" },
        { href: "/faq", label: "FAQ" },
      ],
    },
  ];

  return <Header navItems={navItems} bookingUrl={channels.bookingUrl} />;
}
