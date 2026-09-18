-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('app-assets', 'app-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('apks', 'apks', false, 157286400, ARRAY['application/vnd.android.package-archive', 'application/octet-stream'])
ON CONFLICT (id) DO NOTHING;

-- Public read for public buckets
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Public read project-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Public read app-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app-assets');

-- Admin upload to public buckets
CREATE POLICY "Admin upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND public.is_admin());

CREATE POLICY "Admin upload project-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

CREATE POLICY "Admin upload app-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'app-assets' AND public.is_admin());

CREATE POLICY "Admin update public buckets"
  ON storage.objects FOR UPDATE
  USING (bucket_id IN ('avatars', 'project-images', 'app-assets') AND public.is_admin());

CREATE POLICY "Admin delete public buckets"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('avatars', 'project-images', 'app-assets') AND public.is_admin());

-- APK bucket: admin upload only, NO public SELECT
CREATE POLICY "Admin upload apks"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'apks' AND public.is_admin());

CREATE POLICY "Admin manage apks"
  ON storage.objects FOR ALL
  USING (bucket_id = 'apks' AND public.is_admin());
