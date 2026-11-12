-- Run this SQL in Supabase Dashboard > SQL Editor.
-- It creates customer profiles and enquiries with row-level security.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  contact_name text not null,
  company_name text not null,
  email text not null,
  phone text,
  service text,
  quantity text,
  message text not null,
  drawing_path text,
  status text not null default 'Received',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.enquiries enable row level security;

create policy "Customers can view own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "Customers can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id) with check (auth.uid() = id);

create policy "Customers can insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

create policy "Customers can view own enquiries"
on public.enquiries for select to authenticated
using (auth.uid() = user_id);

create policy "Customers can submit enquiries"
on public.enquiries for insert
with check (user_id is null or auth.uid() = user_id);

-- Important:
-- Anonymous quote submissions are allowed by the insert policy above.
-- They cannot read enquiry records. Only authenticated users can read their own.
-- Do not add public SELECT, UPDATE or DELETE policies.
-- Admin access should be implemented server-side or through a protected admin system,
-- never by putting a service-role key in browser JavaScript.

-- Optional profile creation trigger:
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Storage:
-- Create a private bucket named customer-drawings in Storage.
-- For authenticated customer uploads, use a user-specific folder prefix.
-- The starter quote form currently stores files under random object names;
-- before enabling private customer drawing uploads in production, change it to
-- upload under `${user.id}/${randomFileName}` and add matching storage RLS policies.
-- Anonymous drawing upload is intentionally not enabled by this starter.
