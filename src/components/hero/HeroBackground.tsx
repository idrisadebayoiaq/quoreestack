import Image from "next/image";
import { HeroSceneLoader } from "@/components/hero/HeroSceneLoader";

type HeroBackgroundProps = {
  posterSrc?: string;
};

export function HeroBackground({
  posterSrc = "/images/quorestack-hero-poster.jpg",
}: HeroBackgroundProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[var(--bg-primary)]">
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] opacity-35 grayscale-[35%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/85 to-[var(--bg-primary)]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(var(--accent-rgb),0.16),transparent_45%)]" />
      <HeroSceneLoader />
    </div>
  );
}
