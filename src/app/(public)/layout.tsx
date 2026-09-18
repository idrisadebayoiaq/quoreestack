import { CyberCursor } from "@/components/animations/CyberCursor";
import { Footer } from "@/components/layout/Footer";
import { GridBackground } from "@/components/layout/GridBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GridBackground />
      <CyberCursor />
      <SiteHeader />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
