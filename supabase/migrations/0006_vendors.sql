-- Phase 7: vendor directory. category is plain text (not an enum), same
-- reasoning as tasks: a fixed list the app validates, not one that should
-- require a migration to extend. balance is derived from
-- final_amount/quoted_amount minus advance_paid at query time, same
-- "never drifts" principle as budget_items. Document/image attachments
-- (per the spec) are deferred to the Documents module (Phase 9), which
-- introduces Supabase Storage — a vendor's documents will link back via
-- a vendor_id on that table rather than duplicating upload plumbing here.

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  category text not null default 'Other',
  contact_person text,
  phone text,
  email text,
  website text,
  address text,
  quoted_amount numeric(12, 2),
  final_amount numeric(12, 2),
  advance_paid numeric(12, 2) not null default 0,
  rating smallint,
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendors_rating_range check (rating is null or (rating >= 1 and rating <= 5))
);

create index vendors_wedding_id_idx on public.vendors (wedding_id);

create trigger set_vendors_updated_at
  before update on public.vendors
  for each row
  execute function public.set_updated_at();

alter table public.vendors enable row level security;

create policy "Members can view vendors"
  on public.vendors for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage vendors"
  on public.vendors for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));
