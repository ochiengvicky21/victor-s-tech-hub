create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users (id) on delete cascade,
  job_id text not null,
  title text not null,
  company text not null,
  job_url text not null,
  source text not null,
  location text not null default '',
  employment_type text not null default '',
  posted_at text not null default '',
  status text not null default 'saved'
    check (status in ('saved', 'applied', 'interviewing', 'offer', 'rejected', 'closed')),
  notes text not null default '' check (char_length(notes) <= 5000),
  applied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (admin_user_id, job_id)
);

alter table public.job_applications enable row level security;

create policy "Admins can read their own job applications"
  on public.job_applications
  for select
  using (
    auth.uid() = admin_user_id
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "Admins can add their own job applications"
  on public.job_applications
  for insert
  with check (
    auth.uid() = admin_user_id
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "Admins can update their own job applications"
  on public.job_applications
  for update
  using (
    auth.uid() = admin_user_id
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  with check (
    auth.uid() = admin_user_id
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

create policy "Admins can delete their own job applications"
  on public.job_applications
  for delete
  using (
    auth.uid() = admin_user_id
    and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
