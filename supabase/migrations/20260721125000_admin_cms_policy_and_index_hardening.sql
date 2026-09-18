-- Cover foreign keys used by admin filters and analytics.
CREATE INDEX IF NOT EXISTS idx_downloads_version_id ON public.downloads(version_id);
CREATE INDEX IF NOT EXISTS idx_mobile_apps_category_id ON public.mobile_apps(category_id);
CREATE INDEX IF NOT EXISTS idx_project_categories_category_id ON public.project_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_project_services_service_id ON public.project_services(service_id);
CREATE INDEX IF NOT EXISTS idx_projects_primary_category_id ON public.projects(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_service_categories_category_id ON public.service_categories(category_id);

-- Avoid re-evaluating auth.uid() for every row.
DROP POLICY IF EXISTS "Public profiles readable by owner" ON public.profiles;
CREATE POLICY "Public profiles readable by owner"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id OR public.is_admin());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users see own downloads" ON public.downloads;
CREATE POLICY "Users see own downloads"
  ON public.downloads FOR SELECT
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can log downloads" ON public.downloads;
CREATE POLICY "Authenticated users can log downloads"
  ON public.downloads FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Replace broad admin ALL policies with write-only policies so public SELECT
-- policies remain the single SELECT path.
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin insert categories" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update categories" ON public.categories FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete categories" ON public.categories FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Admin insert services" ON public.services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update services" ON public.services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete services" ON public.services FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage projects" ON public.projects;
CREATE POLICY "Admin insert projects" ON public.projects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update projects" ON public.projects FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete projects" ON public.projects FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage mobile_apps" ON public.mobile_apps;
CREATE POLICY "Admin insert mobile_apps" ON public.mobile_apps FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update mobile_apps" ON public.mobile_apps FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete mobile_apps" ON public.mobile_apps FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage app_versions" ON public.app_versions;
CREATE POLICY "Admin insert app_versions" ON public.app_versions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update app_versions" ON public.app_versions FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete app_versions" ON public.app_versions FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage junctions" ON public.project_categories;
CREATE POLICY "Admin insert project_categories" ON public.project_categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update project_categories" ON public.project_categories FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete project_categories" ON public.project_categories FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage service_categories" ON public.service_categories;
CREATE POLICY "Admin insert service_categories" ON public.service_categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update service_categories" ON public.service_categories FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete service_categories" ON public.service_categories FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage project_services" ON public.project_services;
CREATE POLICY "Admin insert project_services" ON public.project_services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update project_services" ON public.project_services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete project_services" ON public.project_services FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manage site settings" ON public.site_settings;
CREATE POLICY "Admin insert site settings" ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site settings" ON public.site_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete site settings" ON public.site_settings FOR DELETE USING (public.is_admin());

CREATE POLICY "Admin delete contacts"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin());

-- Public buckets already serve objects through public URLs.
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read project-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read app-assets" ON storage.objects;
