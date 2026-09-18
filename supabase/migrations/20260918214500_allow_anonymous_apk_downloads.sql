-- Allow APK download analytics without requiring a signed-in user
ALTER TABLE public.downloads
  ALTER COLUMN user_id DROP NOT NULL;

-- Promote all existing accounts to admin (site operators)
UPDATE public.profiles
SET role = 'admin'
WHERE role IS DISTINCT FROM 'admin';
