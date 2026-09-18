import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.author}`,
    short_name: siteConfig.name,
    description:
      "Full Stack Developer portfolio, web projects, and Android app downloads.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#1ad4a8",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
