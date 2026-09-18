-- Blogs CMS table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  cover_image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Quoreeb Adebayo',
  tags TEXT[] DEFAULT '{}',
  reading_time_minutes INT,
  published_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blogs_status_sort_idx ON public.blogs (status, sort_order);
CREATE INDEX IF NOT EXISTS blogs_featured_idx ON public.blogs (featured) WHERE featured = true;

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anonymous read published blogs" ON public.blogs;
CREATE POLICY "Anonymous read published blogs"
  ON public.blogs FOR SELECT TO anon
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated read blogs" ON public.blogs;
CREATE POLICY "Authenticated read blogs"
  ON public.blogs FOR SELECT TO authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage blogs" ON public.blogs;
CREATE POLICY "Admin manage blogs"
  ON public.blogs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
