-- Phase 6: budget items and payment tracking.
-- budget_categories is a real per-wedding table (not an enum) so it can be
-- edited later without a migration; it's seeded with the spec's default
-- category list whenever create_wedding runs.
-- remaining_amount and payment_status for budget_items are deliberately
-- NOT stored columns — they're derived from actual_amount/amount_paid at
-- query time so they can never drift out of sync (same principle as the
-- wedding's own budget totals).

create type public.payment_status as enum ('not_paid', 'partially_paid', 'fully_paid');
create type public.payment_method as enum ('cash', 'upi', 'bank_transfer', 'card', 'other');

create table public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (wedding_id, name)
);

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  category_id uuid references public.budget_categories (id) on delete set null,
  description text not null,
  vendor text,
  planned_amount numeric(12, 2) not null default 0,
  actual_amount numeric(12, 2),
  amount_paid numeric(12, 2) not null default 0,
  due_date date,
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  vendor text,
  description text not null,
  amount numeric(12, 2) not null,
  payment_date date,
  payment_method public.payment_method,
  payment_status public.payment_status not null default 'not_paid',
  due_date date,
  reference_id text,
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index budget_categories_wedding_id_idx on public.budget_categories (wedding_id);
create index budget_items_wedding_id_idx on public.budget_items (wedding_id);
create index budget_items_wedding_id_category_idx on public.budget_items (wedding_id, category_id);
create index payments_wedding_id_idx on public.payments (wedding_id);
create index payments_wedding_id_due_date_idx on public.payments (wedding_id, due_date);

create trigger set_budget_items_updated_at
  before update on public.budget_items
  for each row
  execute function public.set_updated_at();

create trigger set_payments_updated_at
  before update on public.payments
  for each row
  execute function public.set_updated_at();

alter table public.budget_categories enable row level security;
alter table public.budget_items enable row level security;
alter table public.payments enable row level security;

create policy "Members can view budget categories"
  on public.budget_categories for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage budget categories"
  on public.budget_categories for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));

create policy "Members can view budget items"
  on public.budget_items for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage budget items"
  on public.budget_items for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));

create policy "Members can view payments"
  on public.payments for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage payments"
  on public.payments for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));

-- Re-created (not altered) so new weddings also get the default budget
-- category list seeded; existing weddings are unaffected by this replace.
create or replace function public.create_wedding(
  p_bride_name text,
  p_groom_name text,
  p_wedding_date date,
  p_engagement_date date,
  p_reception_date date,
  p_wedding_venue text,
  p_reception_venue text,
  p_city text,
  p_expected_guest_count integer,
  p_estimated_budget numeric,
  p_currency text
)
returns public.weddings
language plpgsql
security definer
set search_path = public
as $$
declare
  new_wedding public.weddings;
  default_category text;
begin
  insert into public.weddings (
    bride_name, groom_name, wedding_date, engagement_date, reception_date,
    wedding_venue, reception_venue, city, expected_guest_count,
    estimated_budget, currency, created_by
  ) values (
    p_bride_name, p_groom_name, p_wedding_date, p_engagement_date, p_reception_date,
    p_wedding_venue, p_reception_venue, p_city, p_expected_guest_count,
    p_estimated_budget, p_currency, auth.uid()
  )
  returning * into new_wedding;

  insert into public.wedding_members (wedding_id, user_id, role, status)
  values (new_wedding.id, auth.uid(), 'owner', 'accepted');

  foreach default_category in array array[
    'Venue', 'Catering', 'Decoration', 'Photography', 'Videography', 'Clothing',
    'Jewellery', 'Makeup', 'Invitations', 'Transportation', 'Accommodation',
    'Music', 'Gifts', 'Ceremony', 'Reception', 'Honeymoon', 'Miscellaneous'
  ]
  loop
    insert into public.budget_categories (wedding_id, name) values (new_wedding.id, default_category);
  end loop;

  return new_wedding;
end;
$$;
