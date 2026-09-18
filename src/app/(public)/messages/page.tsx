import { redirect } from "next/navigation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { createClient } from "@/lib/supabase/server";
import type { ConversationWithUser, MessageWithSender } from "@/lib/messages/types";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email, full_name, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/login?next=/messages");
  if (profile.role === "admin") redirect("/admin/messages");

  const { data: admin } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*, profiles:user_id(id, email, full_name, avatar_url, role, created_at)")
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false });

  const firstId = conversations?.[0]?.id;
  const { data: messages } = firstId
    ? await supabase
        .from("messages")
        .select("*, profiles:sender_id(id, email, full_name, avatar_url, role)")
        .eq("conversation_id", firstId)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <main className="mx-auto w-full max-w-7xl px-0 md:px-4 md:py-4">
      <MessagesWorkspace
        mode="user"
        currentUserId={user.id}
        initialConversations={(conversations ?? []) as ConversationWithUser[]}
        initialMessages={(messages ?? []) as MessageWithSender[]}
        initialConversationId={firstId ?? null}
        adminProfile={admin}
      />
    </main>
  );
}
