-- Adds vendor comparison/shortlisting: pros/cons per vendor, a status
-- (considering/selected/rejected), and a guarantee that at most one vendor
-- per category is "selected" at a time — enforced by a partial unique
-- index, not just app-level checking, so it holds even under a race.

create type public.vendor_status as enum ('considering', 'selected', 'rejected');

alter table public.vendors add column status public.vendor_status not null default 'considering';
alter table public.vendors add column pros text;
alter table public.vendors add column cons text;

create unique index vendors_one_selected_per_category
  on public.vendors (wedding_id, category)
  where status = 'selected';

-- SECURITY INVOKER (the default) — relies on the existing "Editors can
-- manage vendors" RLS policy for both updates, same as any other vendor
-- edit. Demotes whichever vendor currently holds "selected" in this
-- vendor's category before promoting this one, so the swap is atomic:
-- the partial unique index above can never see two selected rows at once,
-- and the caller never has to handle a constraint-violation error.
create function public.select_vendor(p_vendor_id uuid)
returns void
language plpgsql
as $$
declare
  target_wedding_id uuid;
  target_category text;
begin
  select wedding_id, category into target_wedding_id, target_category
  from public.vendors
  where id = p_vendor_id;

  if target_wedding_id is null then
    raise exception 'Vendor not found';
  end if;

  update public.vendors
  set status = 'considering'
  where wedding_id = target_wedding_id
    and category = target_category
    and status = 'selected'
    and id <> p_vendor_id;

  update public.vendors
  set status = 'selected'
  where id = p_vendor_id;
end;
$$;

grant execute on function public.select_vendor to authenticated;
