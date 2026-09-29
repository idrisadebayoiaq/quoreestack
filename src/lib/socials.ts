export type SocialLink = {
  key: string;
  label: string;
  href: string;
};

export type SocialSetting = Partial<
  Record<"github" | "linkedin" | "x" | "instagram" | "facebook", string>
>;

export type ContactSetting = {
  email?: string;
  whatsapp?: string;
  booking_url?: string;
  response_note?: string;
};

const SOCIAL_ORDER: Array<{ key: keyof SocialSetting; label: string }> = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
];

export const fallbackSocial: SocialSetting = {
  x: "https://x.com/idrisadebayoiaq",
  instagram: "https://instagram.com/idrisadebayoiaq",
  facebook: "https://facebook.com/idrisadebayoiaq",
};

export const fallbackEmail = "adebayoquoreeb@gmail.com";

/** Only entries with a real URL are returned, in a stable professional-first order. */
export function toSocialLinks(setting?: SocialSetting | null): SocialLink[] {
  const source = setting && Object.keys(setting).length ? setting : fallbackSocial;
  return SOCIAL_ORDER.flatMap(({ key, label }) => {
    const href = source[key]?.trim();
    return href && /^https?:\/\//i.test(href) ? [{ key, label, href }] : [];
  });
}

export function xHandle(links: SocialLink[]) {
  const x = links.find((link) => link.key === "x");
  const handle = x?.href.replace(/\/$/, "").split("/").pop();
  return handle ? `@${handle}` : undefined;
}

export function whatsappHref(raw?: string | null) {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}`;
}
