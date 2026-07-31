create table if not exists public.submissions (
  id text primary key,
  name text not null,
  email text not null,
  age text not null,
  gender text not null,
  quiz_type text not null,
  headline text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create policy if not exists "Allow insert for anon"
  on public.submissions
  for insert
  to anon
  with check (true);

create policy if not exists "Allow select for anon"
  on public.submissions
  for select
  to anon
  using (true);
