-- ============================================================================
-- Payment Domain — Database Migration
-- All monetary columns store minor units (integers):
--   KES: whole shillings  |  USD/EUR/GBP: cents
-- ============================================================================

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type payment_method as enum (
  'mpesa',
  'visa',
  'mastercard'
);

create type payment_status as enum (
  'initiated',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'partially_refunded',
  'fully_refunded',
  'pending_review'
);

create type refund_status as enum (
  'requested',
  'processing',
  'completed',
  'failed',
  'rejected'
);

create type refund_reason as enum (
  'customer_request',
  'duplicate_payment',
  'fraudulent',
  'booking_cancelled',
  'service_not_provided',
  'partial_service',
  'other'
);

-- ─── Payments ─────────────────────────────────────────────────────────────────

create table if not exists payments (
  id                   uuid primary key default uuid_generate_v4(),

  booking_id           uuid not null references bookings (id),
  guest_id             uuid not null references guests (id),

  -- Provider transaction reference (set on confirmation)
  provider_payment_id  text unique,

  method               payment_method not null,
  status               payment_status not null default 'initiated',
  currency             char(3) not null,

  -- All amounts in minor units (integer)
  amount               bigint not null check (amount > 0),
  amount_captured      bigint not null default 0 check (amount_captured >= 0),
  amount_refunded      bigint not null default 0 check (amount_refunded >= 0),
  fee_amount           bigint not null default 0 check (fee_amount >= 0),
  net_amount           bigint not null default 0,

  -- Provider-specific fields (JSONB — see types.ts for shape)
  method_details       jsonb  not null default '{}',

  -- Free-form caller metadata
  metadata             jsonb  not null default '{}',

  failure_code         text,
  failure_message      text,
  paid_at              timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  constraint payments_refunded_lte_captured
    check (amount_refunded <= amount_captured),
  constraint payments_captured_lte_amount
    check (amount_captured <= amount)
);

-- One active (non-failed/cancelled) payment per booking
create unique index payments_booking_active_idx
  on payments (booking_id)
  where status not in ('failed', 'cancelled');

create index payments_booking_id_idx         on payments (booking_id);
create index payments_guest_id_idx           on payments (guest_id);
create index payments_status_idx             on payments (status);
create index payments_method_idx             on payments (method);
create index payments_provider_payment_idx   on payments (provider_payment_id) where provider_payment_id is not null;
create index payments_created_at_idx         on payments (created_at desc);

-- ─── Refunds ──────────────────────────────────────────────────────────────────

create table if not exists refunds (
  id                   uuid primary key default uuid_generate_v4(),

  payment_id           uuid not null references payments (id),
  booking_id           uuid not null references bookings (id),

  provider_refund_id   text unique,

  status               refund_status not null default 'requested',
  amount               bigint not null check (amount > 0),
  currency             char(3) not null,

  reason               refund_reason not null,
  notes                text,

  approved_by          uuid,   -- auth.users reference
  approved_at          timestamptz,

  failure_code         text,
  failure_message      text,
  completed_at         timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index refunds_payment_id_idx        on refunds (payment_id);
create index refunds_booking_id_idx        on refunds (booking_id);
create index refunds_status_idx            on refunds (status);
create index refunds_created_at_idx        on refunds (created_at desc);

-- ─── Payment Audit Logs ───────────────────────────────────────────────────────

create table if not exists payment_audit_logs (
  id           uuid primary key default uuid_generate_v4(),
  action       text not null,
  payment_id   uuid references payments (id) on delete set null,
  refund_id    uuid references refunds (id)  on delete set null,
  booking_id   uuid references bookings (id) on delete set null,
  actor_id     uuid,
  ip_address   text,
  user_agent   text,
  before_state jsonb,
  after_state  jsonb,
  metadata     jsonb not null default '{}',
  created_at   timestamptz not null default now()
);

create index payment_audit_payment_id_idx  on payment_audit_logs (payment_id);
create index payment_audit_refund_id_idx   on payment_audit_logs (refund_id);
create index payment_audit_actor_id_idx    on payment_audit_logs (actor_id);
create index payment_audit_action_idx      on payment_audit_logs (action);
create index payment_audit_created_at_idx  on payment_audit_logs (created_at desc);

-- ─── Updated-at triggers ─────────────────────────────────────────────────────

create trigger payments_updated_at
  before update on payments
  for each row execute function set_updated_at();  -- reuse trigger from bookings migration

create trigger refunds_updated_at
  before update on refunds
  for each row execute function set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table payments            enable row level security;
alter table refunds             enable row level security;
alter table payment_audit_logs  enable row level security;

-- Guests can read their own payments
create policy "payments_select_own" on payments
  for select to authenticated
  using (guest_id in (
    select g.id from guests g
    where g.email = (select email from auth.users where id = auth.uid())
  ));

-- Refunds follow payment visibility
create policy "refunds_select_own" on refunds
  for select to authenticated
  using (payment_id in (
    select p.id from payments p
    where p.guest_id in (
      select g.id from guests g
      where g.email = (select email from auth.users where id = auth.uid())
    )
  ));

-- Audit logs: service role only
create policy "payment_audit_no_client" on payment_audit_logs
  for all to authenticated using (false);

-- ─── Entity-Relationship Reference ────────────────────────────────────────────
--
--  bookings (1) ────────────< payments (1) >────────────< refunds
--      │                         │
--  guests (1) ──────────────────<┘
--
--  payments  (1) >──< payment_audit_logs
--  refunds   (1) >──< payment_audit_logs
--
-- ─────────────────────────────────────────────────────────────────────────────
