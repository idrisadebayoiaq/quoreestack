"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const HIDDEN_ON = ["/messages", "/start", "/contact"];

export function WhatsAppButton({ href }: { href: string | null }) {
  const pathname = usePathname();
  if (!href || HIDDEN_ON.some((path) => pathname.startsWith(path))) return null;

  return (
    <a
      href={`${href}?text=${encodeURIComponent("Hi Quoreeb, I found you on QuoreeStack and I'd like to talk about a project.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#1f7a4d] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(20,19,17,0.5)] transition hover:bg-[#19663f] md:bottom-6 md:right-6"
    >
      <MessageCircle className="size-4" aria-hidden />
      WhatsApp
    </a>
  );
}
