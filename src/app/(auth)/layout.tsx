import { GridBackground } from "@/components/layout/GridBackground";
import Link from "next/link";
import { siteConfig } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <GridBackground withOrbs />
      <Link
        href="/"
        className="font-display absolute left-6 top-6 text-lg font-bold text-white hover:text-[var(--neon-cyan)]"
      >
        {siteConfig.name}
      </Link>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
