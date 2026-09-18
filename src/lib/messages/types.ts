import type { Tables } from "@/types/database.types";

export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;
export type Profile = Tables<"profiles">;

export type ConversationWithUser = Conversation & {
  profiles: Pick<Profile, "id" | "email" | "full_name" | "avatar_url" | "role" | "created_at"> | null;
};

export type MessageWithSender = Message & {
  profiles: Pick<Profile, "id" | "email" | "full_name" | "avatar_url" | "role"> | null;
};

export function displayName(
  profile?: Pick<Profile, "full_name" | "email"> | null | unknown,
) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return "User";
  }
  const record = profile as Pick<Profile, "full_name" | "email">;
  const name = record.full_name?.trim();
  if (name) return name;
  const email = typeof record.email === "string" ? record.email : "";
  return email.split("@")[0] || "User";
}

export function relativeTime(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

export function formatMessageTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
