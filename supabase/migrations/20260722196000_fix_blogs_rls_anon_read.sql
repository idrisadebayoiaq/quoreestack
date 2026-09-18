-- Admin FOR ALL was evaluated on anon SELECT and called is_admin(),
-- which anon cannot execute (permission denied → empty blog lists).
DROP POLICY IF EXISTS "Admin manage blogs" ON public.blogs;

DROP POLICY IF EXISTS "Admin insert blogs" ON public.blogs;
CREATE POLICY "Admin insert blogs"
  ON public.blogs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update blogs" ON public.blogs;
CREATE POLICY "Admin update blogs"
  ON public.blogs FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete blogs" ON public.blogs;
CREATE POLICY "Admin delete blogs"
  ON public.blogs FOR DELETE TO authenticated
  USING (public.is_admin());
