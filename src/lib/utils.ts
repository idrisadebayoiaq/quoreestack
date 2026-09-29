import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const OPTIMIZABLE_IMAGE_HOSTS = ["aztmrbygerrqkragsncz.supabase.co", "api.dicebear.com"];

/** Must stay in sync with `images.remotePatterns` in next.config.ts. */
export function isOptimizableImage(src?: string | null) {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_IMAGE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "QuoreStack",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://quoreestack.online").replace(/\/$/, ""),
  author: "Quoreeb Adebayo",
  title: "Full Stack Developer",
};
