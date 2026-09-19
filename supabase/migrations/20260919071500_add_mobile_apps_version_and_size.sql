-- Public store listing fields for Expo/direct-download apps
ALTER TABLE public.mobile_apps
  ADD COLUMN IF NOT EXISTS app_version text,
  ADD COLUMN IF NOT EXISTS download_size text;

COMMENT ON COLUMN public.mobile_apps.app_version IS 'Public display version shown on the store listing (e.g. 1.0.2).';
COMMENT ON COLUMN public.mobile_apps.download_size IS 'Public display download size (e.g. 42 MB).';
