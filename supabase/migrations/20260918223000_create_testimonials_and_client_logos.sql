-- Trust content for client conversion (testimonials + logos + contact channels)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  author_name text NOT NULL,
  author_title text,
  company text,
  quote text NOT NULL,
  avatar_url text,
  sort_order integer NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_quote_length CHECK (char_length(quote) >= 10 AND char_length(quote) <= 1000),
  CONSTRAINT testimonials_author_length CHECK (char_length(author_name) >= 2 AND char_length(author_name) <= 120)
);

CREATE TABLE IF NOT EXISTS public.client_logos (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  sort_order integer NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status_sort ON public.testimonials (status, sort_order);
CREATE INDEX IF NOT EXISTS idx_client_logos_status_sort ON public.client_logos (status, sort_order);

CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_client_logos_updated_at
  BEFORE UPDATE ON public.client_logos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous read published testimonials"
  ON public.testimonials FOR SELECT
  USING (status = 'published' OR private.is_admin());

CREATE POLICY "Authenticated read testimonials"
  ON public.testimonials FOR SELECT
  USING (status = 'published' OR private.is_admin());

CREATE POLICY "Admin insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (private.is_admin());

CREATE POLICY "Admin update testimonials"
  ON public.testimonials FOR UPDATE
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Admin delete testimonials"
  ON public.testimonials FOR DELETE
  USING (private.is_admin());

CREATE POLICY "Anonymous read published client logos"
  ON public.client_logos FOR SELECT
  USING (status = 'published' OR private.is_admin());

CREATE POLICY "Authenticated read client logos"
  ON public.client_logos FOR SELECT
  USING (status = 'published' OR private.is_admin());

CREATE POLICY "Admin insert client logos"
  ON public.client_logos FOR INSERT
  WITH CHECK (private.is_admin());

CREATE POLICY "Admin update client logos"
  ON public.client_logos FOR UPDATE
  USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "Admin delete client logos"
  ON public.client_logos FOR DELETE
  USING (private.is_admin());

GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO authenticated;
GRANT SELECT ON public.client_logos TO anon, authenticated;
GRANT ALL ON public.client_logos TO authenticated;

INSERT INTO public.site_settings (key, value)
VALUES (
  'contact',
  '{
    "email": "adebayoquoreeb@gmail.com",
    "whatsapp": "",
    "booking_url": "",
    "response_note": "Usually within 24–48 hours"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
