-- ==============================================================================
-- Motion In Tech — Safe Supabase Database Schema
-- Anti-Overflow & Auto-Cleanup Architecture to prevent database quota exhaustion
-- ==============================================================================

-- 1. Contact Submissions Table
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null,
  email varchar(255) not null,
  company varchar(150),
  service varchar(100),
  budget varchar(100),
  message text not null,
  created_at timestamptz default now(),
  read boolean default false
);

-- Index for fast sorting by newest without full table scans
create index if not exists idx_contact_submissions_created_at
  on public.contact_submissions (created_at desc);

-- 2. Anti-Bloat Trigger: Keep only the latest 500 submissions
-- This guarantees the database table will NEVER overflow or exceed storage limits!
create or replace function prune_old_submissions()
returns trigger as $$
begin
  delete from public.contact_submissions
  where id not in (
    select id from public.contact_submissions
    order by created_at desc
    limit 500
  );
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_prune_submissions on public.contact_submissions;
create trigger trigger_prune_submissions
  after insert on public.contact_submissions
  execute function prune_old_submissions();

-- 3. CMS Content Table (Single-row pattern to guarantee zero database growth)
create table if not exists public.cms_content (
  id text primary key default 'site_cms',
  content jsonb not null,
  updated_at timestamptz default now()
);

-- Ensure only one master row exists
insert into public.cms_content (id, content)
values ('site_cms', '{}'::jsonb)
on conflict (id) do nothing;

-- ==============================================================================
-- Security Policies (Row Level Security)
-- ==============================================================================
alter table public.contact_submissions enable row level security;
alter table public.cms_content enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow public to insert contact submissions" on public.contact_submissions;
drop policy if exists "Allow read access to contact submissions" on public.contact_submissions;
drop policy if exists "Allow public to read CMS content" on public.cms_content;
drop policy if exists "Allow update CMS content" on public.cms_content;

-- Anyone can submit the contact form
create policy "Allow public to insert contact submissions"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (length(name) <= 150 and length(email) <= 255 and length(message) <= 4000);

-- Submissions can be viewed by anyone with the anon key or authenticated users
create policy "Allow read access to contact submissions"
  on public.contact_submissions for select
  to anon, authenticated
  using (true);

-- Anyone can read CMS content for rendering website
create policy "Allow public to read CMS content"
  on public.cms_content for select
  to anon, authenticated
  using (true);

-- Anyone with app key can update CMS content (single row)
create policy "Allow update CMS content"
  on public.cms_content for update
  to anon, authenticated
  using (id = 'site_cms')
  with check (id = 'site_cms');

create policy "Allow insert CMS content"
  on public.cms_content for insert
  to anon, authenticated
  with check (id = 'site_cms');
