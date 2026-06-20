-- KETSTUDIO — Supabase schema setup
-- Run this in: Supabase Dashboard > SQL Editor > New query > paste > Run
-- Safe to re-run (idempotent).

-- ============ CONTENT TABLES (public read) ============

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null default '',
  image_url text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '',
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  video_url text,
  client_name text,
  category text not null,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- live site link, shown in the work detail modal (safe if already exists)
alter table public.portfolio_items add column if not exists url text;

-- ============ SUBMISSION TABLES (public insert only) ============

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  appointment_date timestamptz not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  project_description text not null,
  budget_range text,
  timeline text,
  attachments_url text[],
  status text not null default 'new'
    check (status in ('new','reviewed','quoted','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ============ ROW LEVEL SECURITY ============

alter table public.team_members enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.appointments enable row level security;
alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;

-- Content: anyone can read; only authenticated (dashboard/admin) can write
drop policy if exists "public read team" on public.team_members;
create policy "public read team" on public.team_members for select using (true);

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (true);

drop policy if exists "public read portfolio" on public.portfolio_items;
create policy "public read portfolio" on public.portfolio_items for select using (true);

-- Submissions: anyone can insert; nobody can read with the anon key
drop policy if exists "public insert appointments" on public.appointments;
create policy "public insert appointments" on public.appointments
  for insert with check (true);

drop policy if exists "public insert quotes" on public.quote_requests;
create policy "public insert quotes" on public.quote_requests
  for insert with check (true);

drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages
  for insert with check (true);

-- ============ INTAKE QUESTIONNAIRE (pre-booking lead capture) ============
-- Public insert + public update (finalize a partial row by id); no public read.

create table if not exists public.intake_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  website_url text,
  target_audience text,
  customer_location text,
  services jsonb not null default '[]'::jsonb,
  has_branding_assets text,
  ad_budget text,
  design_archetype text,
  budget_alignment text,
  email text,
  phone text,
  status text not null default 'partial'
    check (status in ('partial','finalized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.intake_leads enable row level security;

drop policy if exists "public insert intake" on public.intake_leads;
create policy "public insert intake" on public.intake_leads
  for insert with check (true);

drop policy if exists "public update intake" on public.intake_leads;
create policy "public update intake" on public.intake_leads
  for update using (true) with check (true);

-- The public form writes ONLY through the SECURITY DEFINER function below, so we
-- do not need to grant table DML to anon. (Kept minimal on purpose: no read access.)

-- Insert-or-update a lead by id in one controlled call. SECURITY DEFINER runs as
-- the table owner (bypasses RLS) so anonymous visitors can create/update their
-- own row without us ever opening read access to the leads table.
create or replace function public.upsert_intake_lead(
  p_id uuid,
  p_payload jsonb,
  p_status text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_status not in ('partial', 'finalized') then
    raise exception 'invalid status: %', p_status;
  end if;

  insert into public.intake_leads (
    id, company_name, website_url, target_audience, customer_location,
    services, has_branding_assets, ad_budget, design_archetype,
    budget_alignment, email, phone, status
  ) values (
    coalesce(p_id, gen_random_uuid()),
    nullif(p_payload->>'company_name', ''),
    p_payload->>'website_url',
    p_payload->>'target_audience',
    p_payload->>'customer_location',
    coalesce(p_payload->'services', '[]'::jsonb),
    p_payload->>'has_branding_assets',
    p_payload->>'ad_budget',
    p_payload->>'design_archetype',
    p_payload->>'budget_alignment',
    p_payload->>'email',
    p_payload->>'phone',
    p_status
  )
  on conflict (id) do update set
    company_name        = excluded.company_name,
    website_url         = excluded.website_url,
    target_audience     = excluded.target_audience,
    customer_location   = excluded.customer_location,
    services            = excluded.services,
    has_branding_assets = excluded.has_branding_assets,
    ad_budget           = excluded.ad_budget,
    design_archetype    = excluded.design_archetype,
    budget_alignment    = excluded.budget_alignment,
    email               = excluded.email,
    phone               = excluded.phone,
    status              = excluded.status,
    updated_at          = now()
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.upsert_intake_lead(uuid, jsonb, text) from public;
grant execute on function public.upsert_intake_lead(uuid, jsonb, text) to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_intake_leads_updated_at on public.intake_leads;
create trigger trg_intake_leads_updated_at
  before update on public.intake_leads
  for each row execute function public.set_updated_at();

-- ============ SEED DATA (placeholder content — edit in dashboard later) ============

insert into public.team_members (name, role, bio, "order")
select * from (values
  ('Erik Villa', 'Software Developer', 'Builds fast, accessible web experiences with a focus on clean architecture and detail.', 1),
  ('Kai Saucedo', 'Marketing Specialist', 'Crafts brand strategy and campaigns that connect businesses with the right audience.', 2),
  ('Kaena Cavasso', 'Marketing Specialist', 'Drives growth through content, positioning, and data-informed marketing.', 3)
) as t(name, role, bio, "order")
where not exists (select 1 from public.team_members);

insert into public.services (title, description, icon, "order")
select * from (values
  ('Web Design', 'Custom website design and UX built around your goals — fast, responsive, and made to convert.', 'layout', 1),
  ('Branding', 'Logo, brand identity, and visual systems that make your business unmistakable.', 'pen-tool', 2),
  ('Clothing Store Setup', 'E-commerce store creation and optimization — from product pages to checkout.', 'shopping-bag', 3),
  ('Strategy', 'Business and marketing strategy consultation to position you for growth.', 'compass', 4),
  ('Consultation', 'Expert guidance on your projects — get clarity before you commit resources.', 'message-circle', 5),
  ('Management', 'Ongoing project and account management so your digital presence keeps performing.', 'settings', 6)
) as t(title, description, icon, "order")
where not exists (select 1 from public.services);

insert into public.portfolio_items (title, description, client_name, category, "order")
select * from (values
  ('Modern E-commerce Storefront', 'Full store build for an emerging streetwear label — product catalog, checkout, and brand-aligned design.', 'Demo Project', 'E-commerce', 1),
  ('Brand Identity System', 'Logo, typography, and visual language for a boutique consultancy entering a crowded market.', 'Demo Project', 'Branding', 2),
  ('Agency Portfolio Site', 'Minimal, typography-first website designed to let the work speak for itself.', 'Demo Project', 'Web Design', 3)
) as t(title, description, client_name, category, "order")
where not exists (select 1 from public.portfolio_items);
