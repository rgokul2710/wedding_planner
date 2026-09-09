-- Phase 9: documents + inspiration, and Supabase Storage.
-- Both buckets are private — every read/write goes through a signed URL
-- or an authenticated request, never a public bucket URL. Storage RLS
-- mirrors the table RLS: the first path segment of every object is the
-- wedding_id, so is_wedding_member/is_wedding_editor gate access exactly
-- like they do for every other table.

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false), ('inspiration', 'inspiration', false);

create policy "Wedding members can read documents"
  on storage.objects for select
  using (bucket_id = 'documents' and public.is_wedding_member((storage.foldername(name))[1]::uuid));

create policy "Wedding editors can upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and public.is_wedding_editor((storage.foldername(name))[1]::uuid));

create policy "Wedding editors can delete documents"
  on storage.objects for delete
  using (bucket_id = 'documents' and public.is_wedding_editor((storage.foldername(name))[1]::uuid));

create policy "Wedding members can read inspiration images"
  on storage.objects for select
  using (bucket_id = 'inspiration' and public.is_wedding_member((storage.foldername(name))[1]::uuid));

create policy "Wedding editors can upload inspiration images"
  on storage.objects for insert
  with check (bucket_id = 'inspiration' and public.is_wedding_editor((storage.foldername(name))[1]::uuid));

create policy "Wedding editors can delete inspiration images"
  on storage.objects for delete
  using (bucket_id = 'inspiration' and public.is_wedding_editor((storage.foldername(name))[1]::uuid));

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  vendor_id uuid references public.vendors (id) on delete set null,
  name text not null,
  category text not null default 'Other',
  storage_path text not null,
  file_size bigint not null,
  mime_type text not null,
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspiration_images (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  category text not null default 'Other',
  storage_path text not null,
  file_size bigint not null,
  mime_type text not null,
  notes text,
  is_favorite boolean not null default false,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create index documents_wedding_id_idx on public.documents (wedding_id);
create index documents_wedding_id_vendor_idx on public.documents (wedding_id, vendor_id);
create index inspiration_images_wedding_id_idx on public.inspiration_images (wedding_id);

create trigger set_documents_updated_at
  before update on public.documents
  for each row
  execute function public.set_updated_at();

alter table public.documents enable row level security;
alter table public.inspiration_images enable row level security;

create policy "Members can view documents"
  on public.documents for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage documents"
  on public.documents for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));

create policy "Members can view inspiration images"
  on public.inspiration_images for select
  using (public.is_wedding_member(wedding_id));

create policy "Editors can manage inspiration images"
  on public.inspiration_images for all
  using (public.is_wedding_editor(wedding_id))
  with check (public.is_wedding_editor(wedding_id));
