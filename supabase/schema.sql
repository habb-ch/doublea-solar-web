-- DoubleA Solar Solutions — Supabase schema
-- Apply via Supabase SQL Editor or `supabase db push`.
-- This schema enables RLS and only allows public INSERTs through the
-- anon role. Reads are restricted to the service role used by the
-- Next.js route handlers.

-- 1. Helper extension (gen_random_uuid)
create extension if not exists "pgcrypto";

-- 2. leads
create table if not exists public.leads (
    id            uuid primary key default gen_random_uuid(),
    created_at    timestamptz not null default now(),
    source        text not null default 'website',
    name          text,
    email         text not null,
    phone         text,
    address       text,
    heating_type  text,
    message       text,
    consent       boolean not null default false,
    status        text not null default 'new',
    ip_hash       text,
    user_agent    text
);

-- Migration: Spalten ergänzen (idempotent, nutzt IF NOT EXISTS)
alter table public.leads add column if not exists address text;
alter table public.leads add column if not exists heating_type text;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

alter table public.leads enable row level security;

-- Allow anonymous (public) clients to INSERT only; consent must be true and
-- email must be provided. No SELECT/UPDATE/DELETE for anon.
drop policy if exists "leads_anon_insert" on public.leads;
create policy "leads_anon_insert"
    on public.leads
    for insert
    to anon
    with check (
        consent = true
        and char_length(coalesce(email, '')) between 5 and 320
    );

-- Service role bypasses RLS automatically. The route handlers use it.

-- 3. solar_calculations
create table if not exists public.solar_calculations (
    id                       uuid primary key default gen_random_uuid(),
    created_at               timestamptz not null default now(),
    lead_id                  uuid references public.leads(id) on delete set null,
    building_type            text,
    canton                   text,
    postal_code              text,
    city                     text,
    roof_area_m2             numeric,
    usable_roof_percent      numeric,
    orientation              text,
    tilt                     text,
    shading                  text,
    annual_consumption_kwh   numeric,
    has_heat_pump            boolean,
    has_ev                   boolean,
    wants_battery            text,
    electricity_price_rappen numeric,
    feed_in_tariff_rappen    numeric,
    financing_interest       text,
    result                   jsonb,
    ip_hash                  text,
    user_agent               text
);

create index if not exists solar_calculations_created_at_idx
    on public.solar_calculations (created_at desc);
create index if not exists solar_calculations_lead_id_idx
    on public.solar_calculations (lead_id);

alter table public.solar_calculations enable row level security;

drop policy if exists "solar_calculations_anon_insert" on public.solar_calculations;
create policy "solar_calculations_anon_insert"
    on public.solar_calculations
    for insert
    to anon
    with check (
        canton is not null
        and roof_area_m2 is not null
        and roof_area_m2 between 10 and 5000
    );

-- 4. Comments / status enum (kept lightweight as text, validated in app layer)
comment on column public.leads.status is
    'new | contacted | qualified | offer_sent | won | lost (validated in app)';
