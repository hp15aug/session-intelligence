-- Create a table for sessions
create table sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text, -- Optional, if we have auth
  url text,
  user_agent text,
  window_width int,
  window_height int,
  duration int default 0, -- in seconds
  event_count int default 0,
  summary text -- Gemini summary
);

-- Create a bucket for recordings
insert into storage.buckets (id, name, public)
values ('session-recordings', 'session-recordings', true);

-- Policy to allow anyone to insert sessions (for the beacon)
-- In a real app, you'd want some form of auth or rate limiting
create policy "Enable insert for all users" on sessions for insert with check (true);
create policy "Enable select for all users" on sessions for select using (true);
create policy "Enable update for all users" on sessions for update using (true);

-- Storage policies
create policy "Give public access to session-recordings" on storage.objects for select using ( bucket_id = 'session-recordings' );
create policy "Allow uploads to session-recordings" on storage.objects for insert with check ( bucket_id = 'session-recordings' );
