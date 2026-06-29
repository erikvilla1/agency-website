-- Harden intake_leads RLS.
--
-- All intake writes go through the upsert_intake_lead SECURITY DEFINER function
-- (see src/lib/api/index.ts), which bypasses RLS. The direct public INSERT/UPDATE
-- policies were therefore unused by the app and were allowing anonymous clients
-- to overwrite lead rows. Removing them leaves RLS enabled with no public policy,
-- so anon/authenticated cannot read or write the table directly; only the
-- controlled function can. Reads were never granted to the public.
drop policy if exists "public update intake" on public.intake_leads;
drop policy if exists "public insert intake" on public.intake_leads;

-- Pin search_path on the updated_at trigger function (advisor:
-- function_search_path_mutable). Body only calls now() from pg_catalog, so an
-- empty search_path is safe.
alter function public.set_updated_at() set search_path = '';
