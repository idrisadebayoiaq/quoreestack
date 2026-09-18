-- 1:1 messaging between authenticated users and admin
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_preview TEXT,
  starred BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  attachment_path TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON public.conversations (user_id);
CREATE INDEX IF NOT EXISTS conversations_last_message_idx ON public.conversations (last_message_at DESC);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages (conversation_id, created_at);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own conversations" ON public.conversations;
CREATE POLICY "Users read own conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users insert own conversations" ON public.conversations;
CREATE POLICY "Users insert own conversations"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own conversations" ON public.conversations;
CREATE POLICY "Users update own conversations"
  ON public.conversations FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admin delete conversations" ON public.conversations;
CREATE POLICY "Admin delete conversations"
  ON public.conversations FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Participants read messages" ON public.messages;
CREATE POLICY "Participants read messages"
  ON public.messages FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Participants insert messages" ON public.messages;
CREATE POLICY "Participants insert messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id AND c.user_id = auth.uid()
      )
    )
  );

GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT DELETE ON public.conversations TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Chat participants upload attachments" ON storage.objects;
CREATE POLICY "Chat participants upload attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-attachments');

DROP POLICY IF EXISTS "Chat participants read attachments" ON storage.objects;
CREATE POLICY "Chat participants read attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'chat-attachments');

DROP POLICY IF EXISTS "Admin manage chat attachments" ON storage.objects;
CREATE POLICY "Admin manage chat attachments"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'chat-attachments' AND public.is_admin())
  WITH CHECK (bucket_id = 'chat-attachments' AND public.is_admin());

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
