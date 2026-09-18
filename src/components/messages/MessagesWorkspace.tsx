"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Paperclip,
  Search,
  Send,
  Star,
  MessageSquarePlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  sendMessageAction,
  startConversationAction,
  toggleStarConversationAction,
} from "@/lib/messages/actions";
import {
  displayName,
  formatMessageTime,
  relativeTime,
  type ConversationWithUser,
  type MessageWithSender,
  type Profile,
} from "@/lib/messages/types";

type Props = {
  mode: "user" | "admin";
  currentUserId: string;
  initialConversations: ConversationWithUser[];
  initialMessages: MessageWithSender[];
  initialConversationId?: string | null;
  adminProfile?: Pick<Profile, "id" | "email" | "full_name" | "avatar_url" | "role" | "created_at"> | null;
};

export function MessagesWorkspace({
  mode,
  currentUserId,
  initialConversations,
  initialMessages,
  initialConversationId = null,
  adminProfile = null,
}: Props) {
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversationId || initialConversations[0]?.id || null,
  );
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [starting, setStarting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [conversations, activeId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((item) => {
      const name = displayName(item.profiles).toLowerCase();
      const preview = (item.last_message_preview || "").toLowerCase();
      const subject = (item.subject || "").toLowerCase();
      return name.includes(q) || preview.includes(q) || subject.includes(q);
    });
  }, [conversations, query]);

  const threadMessages = useMemo(
    () => messages.filter((item) => item.conversation_id === activeId),
    [messages, activeId],
  );

  const detailProfile =
    mode === "admin"
      ? active?.profiles
      : adminProfile || {
          id: "admin",
          email: "admin@quorestack.dev",
          full_name: "Quoreeb Adebayo",
          avatar_url: null,
          role: "admin" as const,
          created_at: new Date().toISOString(),
        };

  const loadMessages = useCallback(async (conversationId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*, profiles:sender_id(id, email, full_name, avatar_url, role)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      const normalized = (data as MessageWithSender[]).map((item) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] ?? null : item.profiles,
      }));
      setMessages((prev) => {
        const others = prev.filter((item) => item.conversation_id !== conversationId);
        return [...others, ...normalized];
      });
    }
  }, []);

  const refreshConversations = useCallback(async () => {
    const supabase = createClient();
    let queryBuilder = supabase
      .from("conversations")
      .select("*, profiles:user_id(id, email, full_name, avatar_url, role, created_at)")
      .order("last_message_at", { ascending: false });
    if (mode === "user") queryBuilder = queryBuilder.eq("user_id", currentUserId);
    const { data, error } = await queryBuilder;
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setConversations(
        (data as ConversationWithUser[]).map((item) => ({
          ...item,
          profiles: Array.isArray(item.profiles) ? item.profiles[0] ?? null : item.profiles,
        })),
      );
    }
  }, [currentUserId, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.length, activeId]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`quorestack-messages-${mode}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const row = payload.new as Partial<MessageWithSender>;
          if (!row.id || !row.conversation_id || !row.sender_id || !row.body) {
            await refreshConversations();
            return;
          }
          let sender = null;
          const { data } = await supabase
            .from("profiles")
            .select("id, email, full_name, avatar_url, role")
            .eq("id", row.sender_id)
            .maybeSingle();
          sender = data;
          setMessages((prev) => {
            if (prev.some((item) => item.id === row.id)) return prev;
            return [
              ...prev,
              {
                id: row.id!,
                conversation_id: row.conversation_id!,
                sender_id: row.sender_id!,
                body: row.body!,
                attachment_path: row.attachment_path ?? null,
                attachment_name: row.attachment_name ?? null,
                created_at: row.created_at ?? new Date().toISOString(),
                profiles: sender,
              },
            ];
          });
          await refreshConversations();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          void refreshConversations();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [mode, refreshConversations]);

  function selectConversation(id: string) {
    setActiveId(id);
    setError(null);
    void loadMessages(id);
  }

  function onStartChat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setError(null);
    setStarting(true);
    startTransition(async () => {
      const result = await startConversationAction({}, form);
      setStarting(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      formEl.reset();
      await refreshConversations();
      if (result.conversationId) {
        setActiveId(result.conversationId);
        await loadMessages(result.conversationId);
      }
    });
  }

  function onSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeId) return;
    const text = draft.trim();
    if (!text) return;

    const form = new FormData();
    form.set("conversation_id", activeId);
    form.set("body", text);
    const file = fileRef.current?.files?.[0];
    if (file && file.size > 0) form.set("attachment", file);

    setError(null);
    startTransition(async () => {
      const result = await sendMessageAction({}, form);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDraft("");
      setFileName(null);
      if (fileRef.current) fileRef.current.value = "";
      await loadMessages(activeId);
      await refreshConversations();
    });
  }

  return (
    <div className="grid h-[min(720px,calc(100vh-8rem))] min-h-[520px] overflow-hidden border border-[var(--border-glow)] bg-[#070b14] lg:grid-cols-[280px_minmax(0,1fr)_280px]">
      {/* Left: conversation list */}
      <aside className="flex min-h-0 flex-col border-b border-[var(--border-glow)] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <p className="font-display text-lg text-white">All messages</p>
          <Search className="size-4 text-[var(--text-muted)]" />
        </div>
        <div className="border-b border-white/5 px-3 py-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-sm border border-[var(--border-glow)] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[var(--neon-cyan)]"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.map((item) => {
            const activeItem = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectConversation(item.id)}
                className={`flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition ${
                  activeItem ? "bg-cyan-400/10" : "hover:bg-white/5"
                }`}
              >
                <Avatar name={displayName(mode === "admin" ? item.profiles : detailProfile)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">
                      {mode === "admin"
                        ? displayName(item.profiles)
                        : displayName(detailProfile)}
                    </p>
                    <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                      {relativeTime(item.last_message_at)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                    {item.last_message_preview || item.subject || "No messages yet"}
                  </p>
                </div>
                {item.starred ? (
                  <Star className="mt-1 size-3.5 shrink-0 fill-[var(--neon-cyan)] text-[var(--neon-cyan)]" />
                ) : null}
              </button>
            );
          })}
          {!filtered.length ? (
            <p className="p-6 text-sm text-[var(--text-muted)]">No conversations yet.</p>
          ) : null}
        </div>
        {mode === "user" ? (
          <form onSubmit={onStartChat} className="space-y-2 border-t border-white/5 p-3">
            <input
              name="subject"
              placeholder="Subject (optional)"
              className="w-full rounded-sm border border-[var(--border-glow)] bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-[var(--neon-cyan)]"
            />
            <textarea
              name="body"
              required
              rows={3}
              placeholder="Start a new conversation…"
              className="w-full rounded-sm border border-[var(--border-glow)] bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-[var(--neon-cyan)]"
            />
            <button
              type="submit"
              disabled={starting || pending}
              className="font-mono-label inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--neon-cyan)] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
            >
              <MessageSquarePlus className="size-3.5" />
              {starting ? "Starting…" : "New chat"}
            </button>
          </form>
        ) : null}
      </aside>

      {/* Center: thread */}
      <section className="flex min-h-0 min-w-0 flex-col border-b border-[var(--border-glow)] lg:border-b-0">
        {active ? (
          <>
            <header className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={displayName(mode === "admin" ? active.profiles : detailProfile)} />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-white">
                    {mode === "admin"
                      ? displayName(active.profiles)
                      : displayName(detailProfile)}
                  </p>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {mode === "admin"
                      ? active.profiles?.email
                      : detailProfile?.email}
                    {active.subject ? ` · ${active.subject}` : ""}
                  </p>
                </div>
              </div>
              {mode === "admin" ? (
                <form action={toggleStarConversationAction}>
                  <input type="hidden" name="conversation_id" value={active.id} />
                  <input type="hidden" name="starred" value={String(!active.starred)} />
                  <button
                    type="submit"
                    className="rounded-sm border border-[var(--border-glow)] p-2 text-[var(--neon-cyan)]"
                    aria-label="Toggle star"
                  >
                    <Star className={`size-4 ${active.starred ? "fill-current" : ""}`} />
                  </button>
                </form>
              ) : null}
            </header>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {threadMessages.map((message) => {
                const mine = message.sender_id === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${mine ? "flex-row-reverse text-right" : ""}`}
                  >
                    <Avatar name={displayName(message.profiles)} size="sm" />
                    <div className={`max-w-[80%] ${mine ? "items-end" : ""}`}>
                      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        <span>{displayName(message.profiles)}</span>
                        <span>{formatMessageTime(message.created_at)}</span>
                      </div>
                      <div
                        className={`rounded-sm border px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
                          mine
                            ? "border-[var(--neon-cyan)]/40 bg-cyan-400/10 text-white"
                            : "border-white/10 bg-white/5 text-slate-200"
                        }`}
                      >
                        {message.body}
                        {message.attachment_name ? (
                          <p className="mt-2 text-xs text-[var(--neon-cyan)]">
                            Attachment: {message.attachment_name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={onSend}
              className="border-t border-white/5 p-4"
              encType="multipart/form-data"
            >
              <textarea
                name="body"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                required
                placeholder="Type a message..."
                className="w-full rounded-sm border border-[var(--border-glow)] bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[var(--neon-cyan)]"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">
                    <Paperclip className="size-4" />
                    <span className="truncate max-w-[10rem]">
                      {fileName || "Attach"}
                    </span>
                    <input
                      ref={fileRef}
                      name="attachment"
                      type="file"
                      className="sr-only"
                      onChange={(event) =>
                        setFileName(event.target.files?.[0]?.name ?? null)
                      }
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={pending || !draft.trim()}
                  className="font-mono-label inline-flex items-center gap-2 rounded-sm bg-[var(--neon-cyan)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  Send
                </button>
              </div>
              {error ? <p className="mt-2 text-xs text-pink-300">{error}</p> : null}
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <p className="font-display text-2xl text-white">Select a conversation</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {mode === "user"
                  ? "Start a new chat from the left panel to message QuoreStack."
                  : "Pick a client conversation to reply."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Right: details */}
      <aside className="hidden min-h-0 flex-col overflow-y-auto border-l border-[var(--border-glow)] lg:flex">
        <div className="border-b border-white/5 px-5 py-4">
          <p className="font-display text-lg text-white">
            About {displayName(detailProfile)}
          </p>
        </div>
        <div className="space-y-6 px-5 py-5 text-sm">
          <div className="flex items-center gap-3">
            <Avatar name={displayName(detailProfile)} size="lg" />
            <div>
              <p className="font-semibold text-white">{displayName(detailProfile)}</p>
              <p className="text-xs text-[var(--text-muted)]">{detailProfile?.email}</p>
            </div>
          </div>
          <dl className="space-y-3">
            <DetailRow
              label="Role"
              value={detailProfile?.role === "admin" ? "Admin" : "Client"}
            />
            <DetailRow
              label="On QuoreStack since"
              value={
                detailProfile?.created_at
                  ? new Date(detailProfile.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
              }
            />
            <DetailRow
              label="Conversation"
              value={active?.subject || "General"}
            />
            <DetailRow
              label="Messages"
              value={String(threadMessages.length)}
            />
            {mode === "admin" && active?.profiles?.email ? (
              <DetailRow label="Reply email" value={active.profiles.email} />
            ) : null}
          </dl>
          <p className="text-xs leading-5 text-[var(--text-muted)]">
            Chat directly inside QuoreStack. Keep project details, timelines, and files in
            one place instead of bouncing to Gmail.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizeClass =
    size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-14 w-14 text-base" : "h-10 w-10 text-xs";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-[var(--neon-cyan)]/40 bg-cyan-400/10 font-mono-label text-[var(--neon-cyan)] ${sizeClass}`}
    >
      {initials || "QS"}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className="max-w-[60%] text-right text-white">{value}</dd>
    </div>
  );
}
