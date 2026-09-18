CREATE UNIQUE INDEX IF NOT EXISTS uq_app_versions_one_latest
  ON public.app_versions (app_id)
  WHERE is_latest = true;

CREATE INDEX IF NOT EXISTS idx_downloads_created_at
  ON public.downloads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_app_created_at
  ON public.downloads (app_id, created_at DESC);
