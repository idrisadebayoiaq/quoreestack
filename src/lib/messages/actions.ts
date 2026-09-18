"use server";

import { createClient } from "@/lib/supabase/server";

export type MessageActionState = {
  error?: string;
  success?: string;
  conversationId?: string;
  messageId?: string;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email, full_name, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) throw new Error("Profile not found.");
  return { supabase, user, profile };
}

export async function startConversationAction(
  _previous: MessageActionState,
  form: FormData,
): Promise<MessageActionState> {
  try {
    const { supabase, profile } = await requireUser();
    if (profile.role === "admin") {
      return { error: "Admins reply inside existing conversations." };
    }

    const subject = String(form.get("subject") ?? "").trim() || "Project discussion";
    const body = String(form.get("body") ?? "").trim();
    if (body.length < 1) return { error: "Write a first message." };
    if (body.length > 5000) return { error: "Message is too long." };

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        user_id: profile.id,
        subject,
        last_message_at: new Date().toISOString(),
        last_message_preview: body.slice(0, 140),
      })
      .select("id")
      .single();

    if (conversationError || !conversation) {
      return { error: conversationError?.message || "Could not start conversation." };
    }

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: profile.id,
        body,
      })
      .select("id")
      .single();

    if (messageError) {
      await supabase.from("conversations").delete().eq("id", conversation.id);
      return { error: messageError.message };
    }

    return {
      success: "Conversation started.",
      conversationId: conversation.id,
      messageId: message?.id,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to start chat." };
  }
}

export async function sendMessageAction(
  _previous: MessageActionState,
  form: FormData,
): Promise<MessageActionState> {
  try {
    const { supabase, profile } = await requireUser();
    const conversationId = String(form.get("conversation_id") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    if (!conversationId) return { error: "Missing conversation." };
    if (body.length < 1) return { error: "Write a message." };
    if (body.length > 5000) return { error: "Message is too long." };

    const { data: conversation, error: conversationLookupError } = await supabase
      .from("conversations")
      .select("id, user_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (conversationLookupError) return { error: conversationLookupError.message };
    if (!conversation) return { error: "Conversation not found." };
    if (profile.role !== "admin" && conversation.user_id !== profile.id) {
      return { error: "You cannot reply in this conversation." };
    }

    const attachment = form.get("attachment");
    let attachmentPath: string | null = null;
    let attachmentName: string | null = null;

    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > 10 * 1024 * 1024) {
        return { error: "Attachment must be 10 MB or smaller." };
      }
      const extension = attachment.name.split(".").pop()?.toLowerCase() || "bin";
      const safeExt = /^[a-z0-9]{1,10}$/.test(extension) ? extension : "bin";
      attachmentPath = `${conversationId}/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
      attachmentName = attachment.name.slice(0, 255);
      const upload = await supabase.storage.from("chat-attachments").upload(attachmentPath, attachment, {
        contentType: attachment.type || "application/octet-stream",
        upsert: false,
      });
      if (upload.error) return { error: upload.error.message };
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: profile.id,
        body,
        attachment_path: attachmentPath,
        attachment_name: attachmentName,
      })
      .select("id")
      .single();

    if (error) {
      if (attachmentPath) {
        await supabase.storage.from("chat-attachments").remove([attachmentPath]);
      }
      return { error: error.message };
    }

    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: body.slice(0, 140),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    if (updateError) {
      return { error: updateError.message };
    }

    // Do not revalidatePath here — remounting /admin/messages can blank the shell
    // when auth cookies are mid-refresh. Client + Realtime update the UI instead.
    return {
      success: "Sent.",
      conversationId,
      messageId: message?.id,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to send." };
  }
}

export async function toggleStarConversationAction(form: FormData) {
  try {
    const { supabase, profile } = await requireUser();
    if (profile.role !== "admin") return;
    const id = String(form.get("conversation_id") ?? "");
    const starred = String(form.get("starred") ?? "") === "true";
    await supabase.from("conversations").update({ starred }).eq("id", id);
  } catch {
    // Keep UI stable if star toggle fails.
  }
}
