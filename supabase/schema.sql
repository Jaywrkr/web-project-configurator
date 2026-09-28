create extension if not exists pgcrypto;

create table if not exists public.web_briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text not null,
  contact_name text not null,
  email text not null,
  phone text not null default '',
  project_type text not null,
  page_count text not null,
  sections jsonb not null default '[]'::jsonb,
  other_section text not null default '',
  product_count text not null default '',
  product_features jsonb not null default '[]'::jsonb,
  commerce_type text not null default '',
  commerce_features jsonb not null default '[]'::jsonb,
  admin_features jsonb not null default '[]'::jsonb,
  brand_status text not null,
  reference_urls jsonb not null default '[]'::jsonb,
  available_content jsonb not null default '[]'::jsonb,
  content_help jsonb not null default '[]'::jsonb,
  integrations jsonb not null default '[]'::jsonb,
  integration_notes text not null default '',
  domain_status text not null,
  hosting_status text not null,
  email_status text not null,
  email_accounts text not null default '',
  deadline text not null,
  deadline_date date,
  budget text not null,
  notes text not null default '',
  complexity_score integer not null check (complexity_score between 0 and 100),
  complexity_level text not null check (complexity_level in ('Baja', 'Media', 'Alta', 'Muy alta')),
  status text not null default 'new'
);

create index if not exists web_briefs_created_at_idx on public.web_briefs (created_at desc);
alter table public.web_briefs enable row level security;
revoke all on table public.web_briefs from anon, authenticated;
grant all on table public.web_briefs to service_role;
