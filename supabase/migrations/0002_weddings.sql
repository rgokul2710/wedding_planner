-- Phase 3: the wedding/project concept. A user belongs to one wedding via
-- wedding_members (kept as its own table, not a column on profiles, so a
-- later phase can support multiple weddings per user with zero migration).

create table public.weddings (
  id uuid primary key default gen_random_uuid(),
  bride_name text not null,
  groom_name text not null,
  wedding_date date not null,
  engagement_date date,
  reception_date date,
  wedding_venue text,
  reception_venue text,
  city text,
  expected_guest_count integer,
  estimated_budget numeric(12, 2),
  currency text not null default 'INR',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_weddings_updated_at
  before update on public.weddings
  for each row
  execute function public.set_updated_at();

create type public.wedding_member_role as enum ('owner', 'partner', 'family', 'viewer');
create type public.wedding_member_status as enum ('pending', 'accepted');

create table public.wedding_members (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role public.wedding_member_role not null default 'viewer',
  invited_email text,
  status public.wedding_member_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (wedding_id, user_id)
);

create index wedding_members_user_id_idx on public.wedding_members (user_id);
create index wedding_members_wedding_id_idx on public.wedding_members (wedding_id);

alter table public.weddings enable row level security;
alter table public.wedding_members enable row level security;

-- SECURITY DEFINER so this can be called from within policies on
-- wedding_members itself without infinite-recursing through RLS.
create function public.is_wedding_member(target_wedding_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.wedding_members
    where wedding_id = target_wedding_id
      and user_id = auth.uid()
      and status = 'accepted'
  );
$$;

create policy "Members can view their wedding"
  on public.weddings for select
  using (public.is_wedding_member(id));

create policy "Authenticated users can create a wedding"
  on public.weddings for insert
  with check (created_by = auth.uid());

create policy "Members can update their wedding"
  on public.weddings for update
  using (public.is_wedding_member(id));

create policy "Members can view their wedding's membership list"
  on public.wedding_members for select
  using (public.is_wedding_member(wedding_id));

create policy "Wedding creator can add themself as owner"
  on public.wedding_members for insert
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1 from public.weddings w
      where w.id = wedding_id and w.created_by = auth.uid()
    )
  );

-- Creates the wedding and its owner membership row atomically, so a
-- mid-flight failure can never leave an orphaned, invisible wedding row.
create function public.create_wedding(
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

  return new_wedding;
end;
$$;

grant execute on function public.create_wedding to authenticated;
