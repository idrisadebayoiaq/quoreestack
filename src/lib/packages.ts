export type EngagementPackage = {
  slug: string;
  name: string;
  price: string;
  timeline: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export type AvailabilitySetting = {
  status?: "open" | "limited" | "waitlist" | "closed";
  label?: string;
  next_opening?: string;
  note?: string;
};

export const defaultPackages: EngagementPackage[] = [
  {
    slug: "mvp",
    name: "MVP Sprint",
    price: "From ₦800,000 / $600",
    timeline: "2–4 weeks",
    summary: "Ship a focused first version your users can try.",
    includes: ["Discovery call", "Core feature build", "Staging deploy", "Handoff notes"],
  },
  {
    slug: "product",
    name: "Product Build",
    price: "Custom quote",
    timeline: "4–10 weeks",
    summary: "Full-stack product delivery from interface to infrastructure.",
    includes: ["Scoped roadmap", "UI + API + database", "Admin CMS", "Launch support"],
    featured: true,
  },
  {
    slug: "retainer",
    name: "Growth Retainer",
    price: "Monthly",
    timeline: "Ongoing",
    summary: "Continuous improvements after launch with priority access.",
    includes: ["Priority support", "Feature iterations", "Performance care", "Async updates"],
  },
];
