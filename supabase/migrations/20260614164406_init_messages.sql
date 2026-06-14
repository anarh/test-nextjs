-- Demo table the app reads from.
create table if not exists messages (
  id bigint generated always as identity primary key,
  content text not null,
  created_at timestamptz not null default now()
);

-- Seed a row so the page has something to show.
insert into messages (content) values ('Hello world from Supabase 👋');

-- Enable Row Level Security and allow anyone (anon/publishable key) to read.
-- This is the piece people most often forget — without it, the public key
-- returns zero rows even though the data is there.
alter table messages enable row level security;

create policy "Allow public read access"
  on messages
  for select
  using (true);
