-- Make admin checks safe inside RLS without recursive profile evaluation.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Separate anonymous published reads from authenticated/admin reads.
DROP POLICY IF EXISTS "Published categories are public" ON public.categories;
CREATE POLICY "Anonymous read published categories" ON public.categories FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Authenticated read categories" ON public.categories FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Published services are public" ON public.services;
CREATE POLICY "Anonymous read published services" ON public.services FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Authenticated read services" ON public.services FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Published projects are public" ON public.projects;
CREATE POLICY "Anonymous read published projects" ON public.projects FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Authenticated read projects" ON public.projects FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Published apps are public" ON public.mobile_apps;
CREATE POLICY "Anonymous read published apps" ON public.mobile_apps FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Authenticated read apps" ON public.mobile_apps FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "App version metadata public" ON public.app_versions;
CREATE POLICY "Anonymous read published app versions" ON public.app_versions FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM public.mobile_apps ma WHERE ma.id = app_id AND ma.status = 'published')
);
CREATE POLICY "Authenticated read app versions" ON public.app_versions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.mobile_apps ma WHERE ma.id = app_id AND ma.status = 'published') OR public.is_admin()
);

-- PostgREST privileges. RLS still controls visible/writable rows.
GRANT SELECT ON public.categories, public.services, public.projects, public.mobile_apps,
  public.project_categories, public.service_categories, public.project_services,
  public.site_settings TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.downloads TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories, public.services, public.projects,
  public.mobile_apps, public.project_categories, public.service_categories,
  public.project_services, public.site_settings TO authenticated;

-- Public clients only receive non-sensitive version columns. apk_path remains unavailable.
REVOKE ALL ON public.app_versions FROM anon, authenticated;
GRANT SELECT (id, app_id, version, version_code, file_size_bytes, changelog, is_latest, created_at)
  ON public.app_versions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_versions TO authenticated;
GRANT SELECT ON public.app_versions_public TO anon, authenticated;
