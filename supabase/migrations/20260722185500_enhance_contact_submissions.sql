-- Extend contact submissions for project intake fields
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS delivery_at timestamptz,
  ADD COLUMN IF NOT EXISTS budget text,
  ADD COLUMN IF NOT EXISTS attachment_path text,
  ADD COLUMN IF NOT EXISTS attachment_name text;

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_budget_len;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_budget_len CHECK (budget IS NULL OR char_length(budget) <= 80);

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_attachment_path_len;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_attachment_path_len CHECK (attachment_path IS NULL OR char_length(attachment_path) <= 500);

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_attachment_name_len;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_attachment_name_len CHECK (attachment_name IS NULL OR char_length(attachment_name) <= 255);

-- Refresh public insert policy to allow new nullable columns
DROP POLICY IF EXISTS "Anyone can submit valid contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit valid contact"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 100
    AND char_length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'
    AND char_length(message) BETWEEN 10 AND 5000
    AND (subject IS NULL OR char_length(subject) <= 200)
    AND (service_interest IS NULL OR char_length(service_interest) <= 120)
    AND (budget IS NULL OR char_length(budget) <= 80)
    AND (attachment_path IS NULL OR char_length(attachment_path) <= 500)
    AND (attachment_name IS NULL OR char_length(attachment_name) <= 255)
    AND is_read = false
  );

-- Private attachment bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contact-attachments',
  'contact-attachments',
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
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Admin-only access to contact attachments (uploads go through service role)
DROP POLICY IF EXISTS "Admin read contact attachments" ON storage.objects;
CREATE POLICY "Admin read contact attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'contact-attachments' AND public.is_admin());

DROP POLICY IF EXISTS "Admin manage contact attachments" ON storage.objects;
CREATE POLICY "Admin manage contact attachments"
  ON storage.objects FOR ALL
  USING (bucket_id = 'contact-attachments' AND public.is_admin())
  WITH CHECK (bucket_id = 'contact-attachments' AND public.is_admin());
