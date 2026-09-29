import Link from "next/link";
import { siteConfig } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-atelier relative flex min-h-screen flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="font-display absolute left-6 top-6 text-xl text-[var(--text-strong)]"
      >
        {siteConfig.name}
      </Link>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
