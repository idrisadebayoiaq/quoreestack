-- Tune download_url for Expo / EAS build artifact links (can be long signed URLs).
ALTER TABLE public.mobile_apps
  DROP CONSTRAINT IF EXISTS mobile_apps_download_url_check;

ALTER TABLE public.mobile_apps
  ADD CONSTRAINT mobile_apps_download_url_check
  CHECK (
    download_url IS NULL
    OR (
      char_length(download_url) <= 8192
      AND download_url ~* '^https?://'
    )
  );

COMMENT ON COLUMN public.mobile_apps.download_url IS
  'Expo EAS (or other) APK artifact download URL. When set, visitors download from this link instead of Supabase storage.';
