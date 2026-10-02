-- ==============================================================================
-- Public read access for Section Lobby ("anyone with the link")
-- ------------------------------------------------------------------------------
-- Students open the site without logging in, so reads must work for the `anon`
-- role. This is ADDITIVE: the existing member/admin policies stay as they are
-- (admins still see archived/draft rows through them; permissive policies OR).
--
-- Writes are NOT touched. Only section admins (private.is_section_admin) can
-- insert / update / delete. `members` and `section_access_credentials` get no
-- public policy, so names, emails and the admin passcode hash stay private.
--
-- Rollback: drop the policies named "Public can read ..." below.
-- ==============================================================================

drop policy if exists "Public can read sections" on public.sections;
create policy "Public can read sections" on public.sections
  for select to anon, authenticated
  using (true);

drop policy if exists "Public can read announcements" on public.announcements;
create policy "Public can read announcements" on public.announcements
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Public can read assignments" on public.assignments;
create policy "Public can read assignments" on public.assignments
  for select to anon, authenticated
  using (status <> 'archived');

drop policy if exists "Public can read tasks" on public.tasks;
create policy "Public can read tasks" on public.tasks
  for select to anon, authenticated
  using (status <> 'archived');

drop policy if exists "Public can read notes" on public.notes;
create policy "Public can read notes" on public.notes
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events" on public.events
  for select to anon, authenticated
  using (status <> 'cancelled');

drop policy if exists "Public can read resources" on public.resources;
create policy "Public can read resources" on public.resources
  for select to anon, authenticated
  using (status = 'active');
