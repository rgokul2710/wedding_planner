-- Phase 10: family/member invites and role management.
-- No email service (free-tier constraint), so an invite is just a pending
-- wedding_members row keyed by email; the invited person claims it
-- automatically on login/signup once their auth email matches, via
-- claim_pending_invites(). The owner shares the invite manually (copy a
-- message, send it however they like) rather than the app sending mail.

-- Prevents inviting the same email twice for one wedding while it's still
-- pending (NULL user_id values don't collide under a plain UNIQUE, so this
-- needs a partial index).
create unique index wedding_members_pending_invite_unique
  on public.wedding_members (wedding_id, lower(invited_email))
  where user_id is null;

-- Owner/partner only — distinct from is_wedding_editor, which also
-- includes 'family' for planning-content tables. Managing who's on the
-- wedding is a narrower permission than managing tasks/guests/budget.
create function public.is_wedding_admin(target_wedding_id uuid)
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
      and role in ('owner', 'partner')
  );
$$;

create policy "Admins can invite members"
  on public.wedding_members for insert
  with check (role in ('partner', 'family', 'viewer') and public.is_wedding_admin(wedding_id));

create policy "Admins can update member roles"
  on public.wedding_members for update
  using (public.is_wedding_admin(wedding_id))
  with check (role <> 'owner');

create policy "Admins can remove members, members can remove themselves"
  on public.wedding_members for delete
  using (
    role <> 'owner'
    and (user_id = auth.uid() or public.is_wedding_admin(wedding_id))
  );

-- Runs on every login. Finds any pending invite addressed to the caller's
-- own auth email and attaches it to their account. SECURITY DEFINER so it
-- can read auth.users (regular clients can't) and bypass the row's own
-- RLS (the caller isn't a member of that wedding yet, so normal RLS would
-- hide the row from them until this claims it).
create function public.claim_pending_invites()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text;
begin
  select email into current_email from auth.users where id = auth.uid();
  if current_email is null then
    return;
  end if;

  update public.wedding_members
  set user_id = auth.uid(), status = 'accepted'
  where user_id is null
    and status = 'pending'
    and lower(invited_email) = lower(current_email);
end;
$$;

grant execute on function public.claim_pending_invites to authenticated;

-- profiles previously only let a user read their own row (Phase 2). The
-- Family page needs to show co-members' display names, so extend that to
-- anyone sharing an accepted membership on the same wedding — still just
-- full_name/avatar_url, nothing else, and never anyone outside a shared wedding.
create policy "Wedding co-members can view each other's profile"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.wedding_members wm1
      join public.wedding_members wm2 on wm1.wedding_id = wm2.wedding_id
      where wm1.user_id = auth.uid()
        and wm1.status = 'accepted'
        and wm2.user_id = profiles.id
        and wm2.status = 'accepted'
    )
  );
