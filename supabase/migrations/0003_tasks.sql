-- Phase 4: task management, and the first module-write permission check.
-- is_wedding_editor() encodes the role table from the app's permission
-- model (owner/partner/family can write, viewer is read-only) and will be
-- reused by every later module's write policies.

create type public.task_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.task_status as enum ('not_started', 'in_progress', 'completed', 'cancelled');

create function public.is_wedding_editor(target_wedding_id uuid)
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
      and role in ('owner', 'partner', 'family')
  );
$$;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'Other',
  assigned_to text,
  due_date date,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'not_started',
  estimated_cost numeric(12, 2),
  actual_cost numeric(12, 2),
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_wedding_id_idx on public.tasks (wedding_id);
create index tasks_wedding_id_due_date_idx on public.tasks (wedding_id, due_date);

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.set_updated_at();

alter table public.tasks enable row level security;

create policy "Members can view wedding tasks"
  on public.tasks for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can create tasks"
  on public.tasks for insert
  with check (public.is_wedding_editor(wedding_id));

create policy "Editors can update tasks"
  on public.tasks for update
  using (public.is_wedding_editor(wedding_id));

create policy "Editors can delete tasks"
  on public.tasks for delete
  using (public.is_wedding_editor(wedding_id));
