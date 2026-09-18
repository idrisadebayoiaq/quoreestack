import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "QuoreStack",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: "Quoreeb Adebayo",
  title: "Full Stack Developer",
};
