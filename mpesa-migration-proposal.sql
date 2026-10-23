-- Proposal only. Review and run manually; this file is never executed by the app.
-- The checked-in payments migration uses the payment_status enum without
-- a pending value and does not define the Daraja fields below.

ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'pending';

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS checkout_request_id text,
  ADD COLUMN IF NOT EXISTS merchant_request_id text,
  ADD COLUMN IF NOT EXISTS mpesa_receipt_number text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS transaction_date text,
  ADD COLUMN IF NOT EXISTS result_code text,
  ADD COLUMN IF NOT EXISTS result_desc text,
  ADD COLUMN IF NOT EXISTS query_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS query_last_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS manual_review_reason text;

CREATE UNIQUE INDEX IF NOT EXISTS payments_checkout_request_id_unique_idx
  ON payments (checkout_request_id)
  WHERE checkout_request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS payments_mpesa_receipt_number_unique_idx
  ON payments (mpesa_receipt_number)
  WHERE mpesa_receipt_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments (id),
  booking_id uuid REFERENCES bookings (id),
  mpesa_receipt text NOT NULL,
  amount bigint NOT NULL,
  phone_number text,
  transaction_date text,
  checkout_request_id text NOT NULL,
  merchant_request_id text NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE receipts
  ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES payments (id),
  ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES bookings (id),
  ADD COLUMN IF NOT EXISTS mpesa_receipt text,
  ADD COLUMN IF NOT EXISTS amount bigint,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS transaction_date text,
  ADD COLUMN IF NOT EXISTS checkout_request_id text,
  ADD COLUMN IF NOT EXISTS merchant_request_id text,
  ADD COLUMN IF NOT EXISTS issued_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS receipts_mpesa_receipt_unique_idx
  ON receipts (mpesa_receipt)
  WHERE mpesa_receipt IS NOT NULL;
