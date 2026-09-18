/**
 * Prevent open redirects — only allow relative paths on this site.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/") {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (next.startsWith("/\\")) return fallback;
  return next;
}
