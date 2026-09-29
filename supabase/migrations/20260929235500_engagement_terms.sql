INSERT INTO public.site_settings (key, value)
VALUES (
  'engagement_terms',
  '[
    {"title":"Deposit & payments","body":"50% deposit to book the slot, 50% on launch. Larger builds are split into milestone payments agreed in the proposal."},
    {"title":"Scope & timeline","body":"You get a written scope and delivery plan before work starts. Changes outside the scope are quoted separately so the timeline stays honest."},
    {"title":"Revisions","body":"Two rounds of revisions on design and two on the finished build are included. Further rounds are billed at the agreed hourly rate."},
    {"title":"Ownership","body":"Once the final payment clears, you own the code, content, domain and hosting accounts. Nothing is locked to me."},
    {"title":"Launch support","body":"30 days of free bug fixes after launch. Ongoing updates are available through the Growth Retainer."},
    {"title":"Communication","body":"Weekly progress updates, a shared preview link throughout the build, and replies within 24–48 hours on WhatsApp or email."}
  ]'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
