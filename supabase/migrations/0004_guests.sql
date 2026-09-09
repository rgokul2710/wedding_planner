-- Phase 5: guest management. guest_groups is its own table (not a text
-- column on guests) so filtering/renaming a family/group is a real
-- relation, not a pile of free-text strings that can drift out of sync.

create type public.rsvp_status as enum ('pending', 'confirmed', 'declined');
create type public.invitation_status as enum ('not_sent', 'sent', 'delivered');

create table public.guest_groups (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (wedding_id, name)
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  guest_group_id uuid references public.guest_groups (id) on delete set null,
  name text not null,
  phone text,
  email text,
  total_guests integer not null default 1,
  child_count integer not null default 0,
  rsvp_status public.rsvp_status not null default 'pending',
  food_preference text,
  accommodation_required boolean not null default false,
  transportation_required boolean not null default false,
  invitation_status public.invitation_status not null default 'not_sent',
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guests_child_count_valid check (child_count >= 0 and child_count <= total_guests)
);

create index guests_wedding_id_idx on public.guests (wedding_id);
create index guests_wedding_id_group_idx on public.guests (wedding_id, guest_group_id);
create index guest_groups_wedding_id_idx on public.guest_groups (wedding_id);

create trigger set_guests_updated_at
  before update on public.guests
  for each row
  execute function public.set_updated_at();

alter table public.guest_groups enable row level security;
alter table public.guests enable row level security;

create policy "Members can view guest groups"
  on public.guest_groups for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage guest groups"
  on public.guest_groups for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));

create policy "Members can view guests"
  on public.guests for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage guests"
  on public.guests for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));
