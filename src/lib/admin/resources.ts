export type AdminResource =
  | "projects"
  | "services"
  | "categories"
  | "apps"
  | "blogs"
  | "testimonials"
  | "logos";
export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "checkbox"
  | "status"
  | "tags"
  | "json"
  | "category"
  | "image"
  | "images"
  | "datetime";

export type ResourceField = {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
};

export type ResourceConfig = {
  table:
    | "projects"
    | "services"
    | "categories"
    | "mobile_apps"
    | "blogs"
    | "testimonials"
    | "client_logos";
  title: string;
  singular: string;
  nameColumn: string;
  fields: ResourceField[];
};

const common = (nameLabel = "Name"): ResourceField[] => [
  { name: "name", label: nameLabel, kind: "text", required: true },
  { name: "slug", label: "Slug", kind: "text", required: true },
  { name: "short_description", label: "Short description", kind: "textarea" },
  { name: "long_description", label: "Long description", kind: "textarea" },
  { name: "status", label: "Status", kind: "status", required: true },
  { name: "featured", label: "Featured", kind: "checkbox" },
  { name: "sort_order", label: "Sort order", kind: "number" },
  { name: "meta_title", label: "SEO title", kind: "text" },
  { name: "meta_description", label: "SEO description", kind: "textarea" },
];

export const resourceConfigs: Record<AdminResource, ResourceConfig> = {
  projects: {
    table: "projects",
    title: "Projects",
    singular: "Project",
    nameColumn: "title",
    fields: [
      ...common("Title").map((field) =>
        field.name === "name" ? { ...field, name: "title" } : field,
      ),
      { name: "primary_category_id", label: "Primary category", kind: "category" },
      { name: "thumbnail_url", label: "Thumbnail", kind: "image" },
      { name: "gallery_urls", label: "Gallery images", kind: "images" },
      { name: "tech_stack", label: "Tech stack", kind: "tags" },
      { name: "client_type", label: "Client type", kind: "text" },
      { name: "role", label: "Role", kind: "text" },
      { name: "duration", label: "Duration", kind: "text" },
      { name: "year", label: "Year", kind: "number" },
      { name: "live_url", label: "Live URL", kind: "url" },
      { name: "github_url", label: "GitHub URL", kind: "url" },
      { name: "results", label: "Results (JSON)", kind: "json" },
    ],
  },
  services: {
    table: "services",
    title: "Services",
    singular: "Service",
    nameColumn: "name",
    fields: [
      ...common(),
      { name: "icon", label: "Icon name", kind: "text" },
      { name: "cover_image_url", label: "Cover image", kind: "image" },
      { name: "technologies", label: "Technologies", kind: "tags" },
      { name: "deliverables", label: "Deliverables (JSON)", kind: "json" },
      { name: "pricing_note", label: "Pricing note", kind: "text" },
    ],
  },
  categories: {
    table: "categories",
    title: "Categories",
    singular: "Category",
    nameColumn: "name",
    fields: [
      ...common(),
      { name: "icon", label: "Icon name", kind: "text" },
      { name: "color", label: "Accent color", kind: "text" },
      { name: "cover_image_url", label: "Cover image", kind: "image" },
    ],
  },
  apps: {
    table: "mobile_apps",
    title: "Mobile apps",
    singular: "App",
    nameColumn: "name",
    fields: [
      ...common(),
      { name: "tagline", label: "Tagline", kind: "text" },
      { name: "category_id", label: "Category", kind: "category" },
      { name: "icon_url", label: "App icon", kind: "image", help: "Square icon, ideally 512×512." },
      {
        name: "screenshot_urls",
        label: "Screenshots",
        kind: "images",
        help: "Upload multiple phone screenshots. Visitors see them in a Play Store–style gallery.",
      },
      { name: "features", label: "Features (JSON)", kind: "json" },
      { name: "tech_stack", label: "Tech stack", kind: "tags" },
      { name: "min_android_version", label: "Minimum Android version", kind: "text" },
      {
        name: "download_url",
        label: "Expo build download URL",
        kind: "url",
        help: "Paste the Android APK install link from Expo / EAS (expo.dev → Builds → your build → Install or Download). Visitors get that APK directly — no file upload needed. Use an APK build, not an AAB.",
      },
    ],
  },
  blogs: {
    table: "blogs",
    title: "Blogs",
    singular: "Blog",
    nameColumn: "title",
    fields: [
      ...common("Title").map((field) =>
        field.name === "name" ? { ...field, name: "title" } : field,
      ),
      { name: "cover_image_url", label: "Cover image", kind: "image" },
      { name: "author", label: "Author", kind: "text", required: true },
      {
        name: "published_at",
        label: "Publish date",
        kind: "datetime",
        help: "Shown on the public blog. Leave blank to use the save time when publishing.",
      },
      { name: "reading_time_minutes", label: "Reading time (minutes)", kind: "number" },
      { name: "tags", label: "Tags", kind: "tags", help: "Comma-separated tags" },
    ],
  },
  testimonials: {
    table: "testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    nameColumn: "author_name",
    fields: [
      { name: "author_name", label: "Client name", kind: "text", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true },
      { name: "author_title", label: "Role / title", kind: "text" },
      { name: "company", label: "Company", kind: "text" },
      { name: "quote", label: "Quote", kind: "textarea", required: true },
      { name: "avatar_url", label: "Avatar", kind: "image" },
      { name: "status", label: "Status", kind: "status", required: true },
      { name: "featured", label: "Featured", kind: "checkbox" },
      { name: "sort_order", label: "Sort order", kind: "number" },
    ],
  },
  logos: {
    table: "client_logos",
    title: "Client logos",
    singular: "Logo",
    nameColumn: "name",
    fields: [
      { name: "name", label: "Client / brand name", kind: "text", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true },
      {
        name: "logo_url",
        label: "Logo image",
        kind: "image",
        required: true,
        help: "Prefer a transparent PNG or SVG-exported PNG on a dark-friendly background.",
      },
      { name: "website_url", label: "Website URL", kind: "url" },
      { name: "status", label: "Status", kind: "status", required: true },
      { name: "featured", label: "Featured", kind: "checkbox" },
      { name: "sort_order", label: "Sort order", kind: "number" },
    ],
  },
};

export function isAdminResource(value: string): value is AdminResource {
  return value in resourceConfigs;
}
