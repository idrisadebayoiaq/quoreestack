import { getSiteSetting } from "@/lib/data/content";
import type { AvailabilitySetting } from "@/lib/packages";
import { Header } from "@/components/layout/Header";

export async function SiteHeader() {
  const availability = await getSiteSetting<AvailabilitySetting>("availability");
  return <Header availability={availability} />;
}
