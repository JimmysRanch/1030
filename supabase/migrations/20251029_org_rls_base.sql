-- organizations table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- profiles table linking auth.users to org
create table if not exists public.profiles (
  user_id uuid primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

-- Helper to fetch current user's org_id
create or replace function public.current_org_id() returns uuid
language sql stable security definer
set search_path = public
as $$
  select p.org_id
  from public.profiles p
  where p.user_id = auth.uid()
$$;

-- Membership helper
create or replace function public.is_org_member(target_org uuid) returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where user_id = auth.uid() and org_id = target_org);
$$;

-- Example tenants table (clients) for reference pattern
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name  text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.clients  enable row level security;

-- Policies
do $$
begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='profiles_select_own') then
    create policy profiles_select_own on public.profiles
      for select using (user_id = auth.uid());
  end if;

  if not exists (select 1 from pg_policies where tablename='clients' and policyname='clients_isolation_select') then
    create policy clients_isolation_select on public.clients
      for select using (public.is_org_member(org_id));
  end if;

  if not exists (select 1 from pg_policies where tablename='clients' and policyname='clients_isolation_modify') then
    create policy clients_isolation_modify on public.clients
      for insert with check (org_id = public.current_org_id()) to authenticated;

    create policy clients_isolation_update on public.clients
      for update using (org_id = public.current_org_id())
      with check (org_id = public.current_org_id()) to authenticated;

    create policy clients_isolation_delete on public.clients
      for delete using (org_id = public.current_org_id()) to authenticated;
  end if;
end $$;

-- Helpful index
create index if not exists clients_org_created_idx on public.clients(org_id, created_at desc);
