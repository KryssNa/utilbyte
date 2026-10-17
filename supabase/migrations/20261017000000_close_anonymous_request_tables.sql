-- Preserve existing data. Browsers use the Edge Function; only its service role
-- should access these tables directly. A bin ID is a bearer capability at the
-- function boundary, not a PostgREST row-level-security predicate.
REVOKE ALL ON TABLE public.caught_requests FROM anon, authenticated;
REVOKE ALL ON TABLE public.request_catcher_bins FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can read requests by bin_id" ON public.caught_requests;
DROP POLICY IF EXISTS "Anyone can delete their bin requests" ON public.caught_requests;
DROP POLICY IF EXISTS "Anyone can read bin config" ON public.request_catcher_bins;
DROP POLICY IF EXISTS "Anyone can insert bin config" ON public.request_catcher_bins;
DROP POLICY IF EXISTS "Anyone can update bin config" ON public.request_catcher_bins;
DROP POLICY IF EXISTS "Anyone can delete bin config" ON public.request_catcher_bins;
-- Old configurations were publicly writable. Require an authorized operator to
-- review and re-enable them; retain the URLs and captured requests.
UPDATE public.request_catcher_bins SET forward_enabled = false;
