import { redirect } from "next/navigation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { createClient } from "@/lib/supabase/server";
import type { ConversationWithUser, MessageWithSender } from "@/lib/messages/types";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Never return null — that blanks the admin shell content area.
  if (!user) redirect("/login?next=/admin/messages");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  const { data: conversations, error: conversationsError } = await supabase
    .from("conversations")
    .select("*, profiles:user_id(id, email, full_name, avatar_url, role, created_at)")
    .order("last_message_at", { ascending: false });

  const firstId = conversations?.[0]?.id;
  const { data: messages, error: messagesError } = firstId
    ? await supabase
        .from("messages")
        .select("*, profiles:sender_id(id, email, full_name, avatar_url, role)")
        .eq("conversation_id", firstId)
        .order("created_at", { ascending: true })
    : { data: [], error: null };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Inbox</p>
        <h1 className="font-display mt-2 text-3xl">Messages</h1>
      </div>
      {conversationsError || messagesError ? (
        <p className="text-sm text-pink-300">
          {conversationsError?.message || messagesError?.message}
        </p>
      ) : null}
      <MessagesWorkspace
        mode="admin"
        currentUserId={user.id}
        initialConversations={(conversations ?? []) as ConversationWithUser[]}
        initialMessages={(messages ?? []) as MessageWithSender[]}
        initialConversationId={firstId ?? null}
      />
    </div>
  );
}
