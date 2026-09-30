create table public.coloring_artworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  design_id text not null,
  title text not null,
  artwork_data jsonb not null default '{"fills": {}, "strokes": []}'::jsonb,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index coloring_artworks_user_updated_idx
  on public.coloring_artworks (user_id, updated_at desc);

alter table public.coloring_artworks enable row level security;

create policy coloring_artworks_select_own
  on public.coloring_artworks for select to authenticated
  using (auth.uid() = user_id);

create policy coloring_artworks_insert_own
  on public.coloring_artworks for insert to authenticated
  with check (auth.uid() = user_id);

create policy coloring_artworks_update_own
  on public.coloring_artworks for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy coloring_artworks_delete_own
  on public.coloring_artworks for delete to authenticated
  using (auth.uid() = user_id);

create function public.touch_coloring_artwork_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

create trigger coloring_artworks_updated_at
  before update on public.coloring_artworks
  for each row execute function public.touch_coloring_artwork_updated_at();

create table public.coloring_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  design_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, design_id)
);

alter table public.coloring_favorites enable row level security;

create policy coloring_favorites_select_own
  on public.coloring_favorites for select to authenticated
  using (auth.uid() = user_id);

create policy coloring_favorites_insert_own
  on public.coloring_favorites for insert to authenticated
  with check (auth.uid() = user_id);

create policy coloring_favorites_delete_own
  on public.coloring_favorites for delete to authenticated
  using (auth.uid() = user_id);

create table public.coloring_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  design_id text not null,
  artwork_id uuid references public.coloring_artworks (id) on delete set null,
  started_at timestamptz not null default now()
);

create index coloring_sessions_user_started_idx
  on public.coloring_sessions (user_id, started_at desc);

alter table public.coloring_sessions enable row level security;

create policy coloring_sessions_select_own
  on public.coloring_sessions for select to authenticated
  using (auth.uid() = user_id);

create policy coloring_sessions_insert_own
  on public.coloring_sessions for insert to authenticated
  with check (auth.uid() = user_id);

create policy coloring_sessions_update_own
  on public.coloring_sessions for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);