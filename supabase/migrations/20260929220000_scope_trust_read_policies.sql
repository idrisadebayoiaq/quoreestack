-- Anonymous visitors cannot execute private.is_admin(), so any SELECT policy that
-- applies to anon and references it fails the whole query ("permission denied for
-- function is_admin"). Scope each read policy to the role its name describes.

ALTER POLICY "Anonymous read published testimonials" ON public.testimonials
  TO anon
  USING (status = 'published'::content_status);

ALTER POLICY "Authenticated read testimonials" ON public.testimonials
  TO authenticated
  USING ((status = 'published'::content_status) OR private.is_admin());

ALTER POLICY "Anonymous read published client logos" ON public.client_logos
  TO anon
  USING (status = 'published'::content_status);

ALTER POLICY "Authenticated read client logos" ON public.client_logos
  TO authenticated
  USING ((status = 'published'::content_status) OR private.is_admin());
