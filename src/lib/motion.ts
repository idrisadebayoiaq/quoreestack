export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur";

const variants: RevealVariant[] = [
  "fade-up",
  "fade-left",
  "scale",
  "fade-right",
  "blur",
  "fade-down",
];

/** Safe to call from Server Components. */
export function revealVariantForIndex(index: number): RevealVariant {
  return variants[index % variants.length];
}
