import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getContactChannels } from "@/lib/data/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { whatsapp } = await getContactChannels();

  return (
    <div className="theme-atelier relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="relative flex flex-1 flex-col">{children}</div>
      <Footer />
      <WhatsAppButton href={whatsapp} />
    </div>
  );
}
