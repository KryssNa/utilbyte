/*
  # Add Proxy Forwarding Support to Request Catcher

  1. New Tables
    - `request_catcher_bins`
      - `bin_id` (text, primary key) - unique bin identifier
      - `forward_url` (text) - optional target URL to forward requests to
      - `forward_enabled` (boolean) - whether forwarding is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modified Tables
    - `caught_requests`
      - Add `forward_status` (integer) - HTTP status returned by the forwarded target
      - Add `forward_error` (text) - error message if forwarding failed
      - Add `forward_response` (text) - response body from the forwarded target
      - Add `forwarded_at` (timestamptz) - when the request was forwarded

  3. Security
    - Enable RLS on `request_catcher_bins`
    - anon can read/insert/update/delete their own bins (by bin_id knowledge)
    - Service role has full access

  4. Notes
    - Bins are lightweight config records keyed by bin_id
    - forward_url is stored per-bin so all requests to the bin get forwarded
    - No auth required — bin_id acts as a shared secret/token
*/

CREATE TABLE IF NOT EXISTS request_catcher_bins (
  bin_id text PRIMARY KEY,
  forward_url text DEFAULT '',
  forward_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE request_catcher_bins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bin config"
  ON request_catcher_bins
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert bin config"
  ON request_catcher_bins
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update bin config"
  ON request_catcher_bins
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete bin config"
  ON request_catcher_bins
  FOR DELETE
  TO anon
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'caught_requests' AND column_name = 'forward_status'
  ) THEN
    ALTER TABLE caught_requests ADD COLUMN forward_status integer DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'caught_requests' AND column_name = 'forward_error'
  ) THEN
    ALTER TABLE caught_requests ADD COLUMN forward_error text DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'caught_requests' AND column_name = 'forward_response'
  ) THEN
    ALTER TABLE caught_requests ADD COLUMN forward_response text DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'caught_requests' AND column_name = 'forwarded_at'
  ) THEN
    ALTER TABLE caught_requests ADD COLUMN forwarded_at timestamptz DEFAULT NULL;
  END IF;
END $$;
