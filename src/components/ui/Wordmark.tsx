import { cn, siteConfig } from "@/lib/utils";
import { Gear } from "@/components/ui/Gear";

const split = siteConfig.name.search(/Stack$/i);
const head = split > 0 ? siteConfig.name.slice(0, split) : siteConfig.name;
const tail = split > 0 ? siteConfig.name.slice(split) : "";

export function Wordmark({ className, spin = false }: { className?: string; spin?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Gear className={cn("size-[1.15em] text-[var(--neon-cyan)]", spin && "animate-spin-slow")} />
      <span className="font-display !font-extrabold tracking-[0.1em] text-[var(--text-strong)]">
        {head}
        <span className="text-[var(--neon-cyan)]">{tail}</span>
      </span>
    </span>
  );
}
