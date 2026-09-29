import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";

export const defaultOgImage = {
  url: "/images/quorestack-hero-poster.jpg",
  width: 1536,
  height: 1024,
  alt: `${siteConfig.author} — ${siteConfig.title}`,
};

type PageMetadataInput = {
  path: string;
  title?: string;
  description?: string;
  image?: string | null;
  type?: "website" | "article";
};

/**
 * Next.js replaces (not merges) a parent `openGraph` object, and does not
 * derive a canonical URL per route — so every page sets both explicitly.
 */
export function pageMetadata({
  path,
  title,
  description,
  image,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = path === "/" ? "/" : path.replace(/\/$/, "");
  const images = image ? [{ url: image }] : [defaultOgImage];

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "en_NG",
      siteName: siteConfig.name,
      url,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images,
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: images.map((item) => item.url),
    },
  };
}
