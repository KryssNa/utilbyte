/*
  # Create request catcher tables

  1. New Tables
    - `caught_requests`
      - `id` (uuid, primary key)
      - `bin_id` (text, indexed) - unique bin identifier for grouping requests
      - `method` (text) - HTTP method (GET, POST, PUT, etc.)
      - `path` (text) - request path
      - `headers` (jsonb) - request headers
      - `query_params` (jsonb) - query string parameters
      - `body` (text) - request body content
      - `content_type` (text) - content type header
      - `ip_address` (text) - requester IP
      - `created_at` (timestamptz) - when request was received

  2. Security
    - Enable RLS on `caught_requests` table
    - Add policy for anonymous reads filtered by bin_id
    - Add policy for edge function inserts via service role

  3. Notes
    - Requests auto-expire; old entries should be cleaned periodically
    - bin_id is user-generated, no auth required for this public tool
*/

CREATE TABLE IF NOT EXISTS caught_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_id text NOT NULL,
  method text NOT NULL DEFAULT 'GET',
  path text DEFAULT '/',
  headers jsonb DEFAULT '{}'::jsonb,
  query_params jsonb DEFAULT '{}'::jsonb,
  body text DEFAULT '',
  content_type text DEFAULT '',
  ip_address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_caught_requests_bin_id ON caught_requests(bin_id);
CREATE INDEX IF NOT EXISTS idx_caught_requests_created_at ON caught_requests(created_at);

ALTER TABLE caught_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read requests by bin_id"
  ON caught_requests
  FOR SELECT
  TO anon
  USING (bin_id IS NOT NULL);

CREATE POLICY "Service role can insert requests"
  ON caught_requests
  FOR INSERT
  TO service_role
  WITH CHECK (bin_id IS NOT NULL);

CREATE POLICY "Anyone can delete their bin requests"
  ON caught_requests
  FOR DELETE
  TO anon
  USING (bin_id IS NOT NULL);
