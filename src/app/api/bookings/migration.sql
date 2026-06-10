-- ============================================================================
-- Booking API — Database Migration
-- Run in Supabase SQL Editor or via `supabase db push`
-- ============================================================================

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ─── Enum ────────────────────────────────────────────────────────────────────

create type booking_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'checked_in',
  'checked_out'
);

-- ─── Resources ───────────────────────────────────────────────────────────────

create table if not exists resources (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Guests ──────────────────────────────────────────────────────────────────

create table if not exists guests (
  id           uuid primary key default uuid_generate_v4(),
  email        text not null unique,
  first_name   text not null,
  last_name    text not null,
  phone        text,
  country_code char(2),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists guests_email_idx on guests (email);

-- ─── Bookings ─────────────────────────────────────────────────────────────────

create table if not exists bookings (
  id                   uuid primary key default uuid_generate_v4(),
  booking_reference    text not null unique,
  resource_id          uuid not null references resources (id),
  guest_id             uuid not null references guests (id),

  status               booking_status not null default 'pending',

  check_in_date        date not null,
  check_out_date       date not null,
  nights               int  not null generated always as
                         (check_out_date - check_in_date) stored,

  adults               smallint not null default 1,
  children             smallint not null default 0,

  rate_per_night       numeric(12, 2) not null,
  total_amount         numeric(12, 2) not null,
  currency             char(3) not null default 'USD',

  special_requests     text,
  source               text not null default 'direct',
  cancellation_reason  text,

  created_by           uuid,          -- auth.users reference (nullable for flexibility)
  updated_by           uuid,

  checked_in_at        timestamptz,
  checked_out_at       timestamptz,
  cancelled_at         timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  constraint bookings_dates_check check (check_out_date > check_in_date),
  constraint bookings_adults_check check (adults >= 1),
  constraint bookings_children_check check (children >= 0),
  constraint bookings_rate_check check (rate_per_night > 0),
  constraint bookings_total_check check (total_amount > 0)
);

-- Indexes for common query patterns
create index if not exists bookings_resource_id_idx   on bookings (resource_id);
create index if not exists bookings_guest_id_idx      on bookings (guest_id);
create index if not exists bookings_status_idx        on bookings (status);
create index if not exists bookings_reference_idx     on bookings (booking_reference);
create index if not exists bookings_check_in_idx      on bookings (check_in_date);
create index if not exists bookings_check_out_idx     on bookings (check_out_date);
create index if not exists bookings_created_at_idx    on bookings (created_at desc);

-- Overlap prevention at DB level (belt-and-suspenders alongside API logic)
-- Excludes cancelled/checked_out bookings from the constraint
create unique index if not exists bookings_no_overlap_idx
  on bookings (resource_id, check_in_date, check_out_date)
  where status not in ('cancelled', 'checked_out');

-- ─── Audit Logs ───────────────────────────────────────────────────────────────

create table if not exists booking_audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  action      text not null,
  booking_id  uuid references bookings (id) on delete set null,
  resource_id uuid references resources (id) on delete set null,
  actor_id    uuid,
  ip_address  text,
  user_agent  text,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists audit_booking_id_idx  on booking_audit_logs (booking_id);
create index if not exists audit_actor_id_idx    on booking_audit_logs (actor_id);
create index if not exists audit_action_idx      on booking_audit_logs (action);
create index if not exists audit_created_at_idx  on booking_audit_logs (created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table resources           enable row level security;
alter table guests              enable row level security;
alter table bookings            enable row level security;
alter table booking_audit_logs  enable row level security;

-- Resources: readable by authenticated users; writable only via service role
create policy "resources_select" on resources
  for select to authenticated using (true);

-- Guests: users can read their own guest record
create policy "guests_select_own" on guests
  for select to authenticated
  using (email = (select email from auth.users where id = auth.uid()));

-- Bookings: users can read bookings they created
create policy "bookings_select_own" on bookings
  for select to authenticated
  using (created_by = auth.uid());

-- Audit logs: no direct client access (service role only)
create policy "audit_no_client_access" on booking_audit_logs
  for all to authenticated using (false);

-- ─── Updated-at trigger ───────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

create trigger guests_updated_at
  before update on guests
  for each row execute function set_updated_at();
