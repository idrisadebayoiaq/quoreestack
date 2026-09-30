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
    theme_color: "#ff6a13",
    background_color: "#0d0f12",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
