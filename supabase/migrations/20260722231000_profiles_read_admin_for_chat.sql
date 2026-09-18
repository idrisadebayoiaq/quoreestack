-- Let authenticated users read admin identity for messaging UI
DROP POLICY IF EXISTS "Authenticated can read admin profiles" ON public.profiles;
CREATE POLICY "Authenticated can read admin profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (role = 'admin');
