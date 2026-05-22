-- ═══════════════════════════════════════════════════════════════════════════
-- Ubuntu Kreative Village — Availability Engine Schema
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- ROOMS
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists rooms (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  category      text not null,          -- e.g. 'Pokomo Cottages', 'Farm House', 'Penthouses'
  floor         text,                   -- e.g. 'Ground Floor', 'Rooftop'
  capacity      int  not null check (capacity >= 1),
  min_stay      int  not null default 1 check (min_stay >= 1),

  -- Pricing per guest per night (KES)
  bed_only       int not null default 0,
  bed_breakfast  int not null default 0,
  half_board     int not null default 0,
  full_board     int not null default 0,

  is_active     boolean not null default true,
  sort_order    int     not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table rooms is 'All bookable rooms/cottages at Ubuntu Kreative Village';

-- ─────────────────────────────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists bookings (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references rooms(id) on delete restrict,
  guest_name    text not null,
  guest_email   text not null,
  guest_phone   text,
  check_in      date not null,
  check_out     date not null,
  guest_count   int  not null check (guest_count >= 1),
  meal_plan     text not null default 'bed_only'
                  check (meal_plan in ('bed_only','bed_and_breakfast','half_board','full_board')),
  status        text not null default 'pending'
                  check (status in ('pending','confirmed','checked_in','checked_out','cancelled','no_show')),
  total_amount  int  not null default 0,   -- KES, computed at booking time
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint bookings_dates_valid check (check_out > check_in)
);

comment on table bookings is 'Guest reservations. Status "cancelled" frees the room.';

-- Index for the availability overlap query (the hot path)
create index if not exists idx_bookings_room_dates
  on bookings (room_id, check_in, check_out)
  where status in ('confirmed', 'pending', 'checked_in');

create index if not exists idx_bookings_status on bookings (status);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROOM BLOCKS
-- Maintenance windows, owner holds, seasonal closures.
-- room_id NULL = property-wide block (affects every room).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists room_blocks (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid references rooms(id) on delete cascade,  -- NULL = all rooms
  block_type  text not null
                check (block_type in ('maintenance','owner','seasonal_closure')),
  start_date  date not null,
  end_date    date not null,
  reason      text,
  created_by  text,                 -- staff member or system
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint room_blocks_dates_valid check (end_date > start_date)
);

comment on table room_blocks is
  'Blocks a room (or all rooms if room_id is NULL) from being booked. '
  'Does not prevent existing bookings from being served — handle manually.';

create index if not exists idx_room_blocks_dates
  on room_blocks (start_date, end_date);

create index if not exists idx_room_blocks_room_id
  on room_blocks (room_id)
  where room_id is not null;

-- ─────────────────────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER (reusable)
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_rooms_updated_at
  before update on rooms
  for each row execute function set_updated_at();

create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

create trigger trg_room_blocks_updated_at
  before update on room_blocks
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- DATABASE-LEVEL DOUBLE-BOOKING GUARD
-- Exclusion constraint using btree_gist (prevents overlapping bookings
-- for the same room at the DB layer — belt-and-suspenders on top of the API).
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists btree_gist;

alter table bookings
  add constraint no_double_booking
  exclude using gist (
    room_id   with =,
    daterange(check_in, check_out, '[)') with &&
  )
  where (status in ('confirmed', 'pending', 'checked_in'));

comment on constraint no_double_booking on bookings is
  'Prevents overlapping active bookings for the same room at the database level.';

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────

alter table rooms        enable row level security;
alter table bookings     enable row level security;
alter table room_blocks  enable row level security;

-- Public can read active rooms (for the booking widget)
create policy "rooms_public_read"
  on rooms for select
  using (is_active = true);

-- Service role bypasses RLS (the API uses service role key)
-- No additional policies needed for server-side operations.

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED — Ubuntu Kreative Village Room Catalogue
-- ─────────────────────────────────────────────────────────────────────────────

insert into rooms
  (name, slug, category, floor, capacity, min_stay,
   bed_only, bed_breakfast, half_board, full_board, sort_order)
values

-- Pokomo Cottages
('Marula',    'marula',    'Pokomo Cottages', 'Cottage', 2, 2, 5000, 6500,  8500, 10500, 10),
('Shea',      'shea',      'Pokomo Cottages', 'Cottage', 2, 2, 5000, 6500,  8500, 10500, 11),
('Milk Wood', 'milk-wood', 'Pokomo Cottages', 'Cottage', 2, 2, 5000, 6500,  8500, 10500, 12),
('Ebony',     'ebony',     'Pokomo Cottages', 'Cottage', 2, 2, 5000, 6500,  8500, 10500, 13),

-- Farm House — Ground Floor
('Warbugia',    'warbugia',    'Farm House', 'Ground Floor', 2, 2, 7500, 9000, 10500, 12500, 20),
('Locust Bean', 'locust-bean', 'Farm House', 'Ground Floor', 2, 2, 7500, 9000, 10500, 12500, 21),
('Tamarind',    'tamarind',    'Farm House', 'Ground Floor', 2, 2, 7500, 9000, 10500, 12500, 22),

-- Farm House — First Floor
('Sycamore', 'sycamore', 'Farm House', 'First Floor', 2, 2, 7500, 9000, 10500, 12500, 23),
('Mugumo',   'mugumo',   'Farm House', 'First Floor', 2, 2, 7500, 9000, 10500, 12500, 24),
('Baobab',   'baobab',   'Farm House', 'First Floor', 2, 2, 7500, 9000, 10500, 12500, 25),

-- Farm House — Rooftop
('Iroko',        'iroko',        'Farm House', 'Rooftop', 2, 2, 7500, 9000, 10500, 12500, 26),
('Buffalo Thorn','buffalo-thorn','Farm House', 'Rooftop', 2, 2, 7500, 9000, 10500, 12500, 27),

-- Penthouses
('Acacia — Penthouse',   'acacia-penthouse',   'Penthouses', 'First Floor', 2, 2, 9000, 10500, 12000, 14000, 30),
('Iron Wood — Penthouse','iron-wood-penthouse', 'Penthouses', 'First Floor', 2, 2, 9000, 10500, 12000, 14000, 31),
('Neem — Penthouse',     'neem-penthouse',      'Penthouses', 'Rooftop',     2, 3, 9000, 10500, 12000, 14000, 32)

on conflict (slug) do nothing;
