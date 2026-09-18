-- Optional direct APK download URL on mobile apps.
-- When set, visitors download from this link instead of Supabase storage.
ALTER TABLE public.mobile_apps
  ADD COLUMN IF NOT EXISTS download_url text;

ALTER TABLE public.mobile_apps
  DROP CONSTRAINT IF EXISTS mobile_apps_download_url_check;

ALTER TABLE public.mobile_apps
  ADD CONSTRAINT mobile_apps_download_url_check
  CHECK (
    download_url IS NULL
    OR (
      char_length(download_url) <= 2048
      AND download_url ~* '^https?://'
    )
  );

COMMENT ON COLUMN public.mobile_apps.download_url IS
  'Optional direct APK download URL. When set, visitors download from this link instead of Supabase storage.';
