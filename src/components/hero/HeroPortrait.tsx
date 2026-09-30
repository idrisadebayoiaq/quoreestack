import Image from "next/image";

const edgeFade =
  "linear-gradient(to top, transparent, #000 14%), linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)";

type HeroPortraitProps = {
  /** Cut-out portrait with a transparent background. */
  src: string;
  alt: string;
};

export function HeroPortrait({ src, alt }: HeroPortraitProps) {
  return (
    <div className="relative aspect-[930/950] w-full">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 520px, (min-width: 640px) 416px, 352px"
        className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
        style={{
          maskImage: edgeFade,
          WebkitMaskImage: edgeFade,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </div>
  );
}
