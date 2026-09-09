-- Phase 8: wedding events/timeline (engagement, haldi, sangeet, reception,
-- and anything else the couple wants on the calendar) — separate from the
-- three headline dates already stored on weddings itself.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  event_date date not null,
  start_time time,
  end_time time,
  venue text,
  description text,
  responsible_person text,
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_wedding_id_idx on public.events (wedding_id);
create index events_wedding_id_date_idx on public.events (wedding_id, event_date);

create trigger set_events_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "Members can view events"
  on public.events for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage events"
  on public.events for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));
