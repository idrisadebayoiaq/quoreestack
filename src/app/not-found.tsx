import { Footer } from "@/components/layout/Footer";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function RootNotFound() {
  return (
    <div className="theme-atelier flex min-h-screen flex-col">
      <SiteHeader />
      <NotFoundContent />
      <Footer />
    </div>
  );
}
