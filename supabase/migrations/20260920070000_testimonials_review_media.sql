-- Public review submissions + media fields for expandable review cards
alter table public.testimonials add column if not exists image_url text;
alter table public.testimonials add column if not exists rating smallint;
alter table public.testimonials add column if not exists source text not null default 'admin';
alter table public.testimonials add column if not exists email text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'testimonials_rating_range'
  ) then
    alter table public.testimonials
      add constraint testimonials_rating_range
      check (rating is null or (rating >= 1 and rating <= 5));
  end if;
end $$;
