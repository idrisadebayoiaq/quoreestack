export type PublicApp = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  short_description: string | null;
  icon_url: string | null;
  featured: boolean;
  tech_stack: string[] | null;
  min_android_version?: string | null;
  app_version?: string | null;
  download_size?: string | null;
};
