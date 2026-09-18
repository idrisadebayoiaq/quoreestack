ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_email_shape;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_email_shape CHECK (
    char_length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'
  );

DROP POLICY IF EXISTS "Anyone can submit valid contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit valid contact"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 2 AND 100
    AND char_length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'
    AND char_length(message) BETWEEN 10 AND 5000
    AND (subject IS NULL OR char_length(subject) <= 200)
    AND (service_interest IS NULL OR char_length(service_interest) <= 120)
    AND is_read = false
  );
