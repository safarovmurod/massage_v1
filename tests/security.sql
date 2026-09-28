-- Run in SQL Editor. Everything, including test users, is rolled back.
BEGIN;
INSERT INTO auth.users(id, email, raw_user_meta_data) VALUES
 ('10000000-0000-4000-8000-000000000001','security-normal@example.invalid','{}'),
 ('10000000-0000-4000-8000-000000000002','security-admin@example.invalid','{}'),
 ('10000000-0000-4000-8000-000000000003','security-blocked@example.invalid','{}');
UPDATE public.profiles SET role='admin' WHERE id IN ('10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003');
UPDATE public.profiles SET is_active=false WHERE id='10000000-0000-4000-8000-000000000003';
SELECT set_config('request.headers', '{"x-forwarded-for":"security-test-fixture"}', true);
SET LOCAL ROLE anon;
DO $$ BEGIN
  IF public.is_admin() THEN RAISE EXCEPTION 'anonymous admin bypass'; END IF;
  IF EXISTS(SELECT 1 FROM public.profiles) THEN RAISE EXCEPTION 'anonymous profile leak'; END IF;
  IF EXISTS(SELECT 1 FROM public.leads) THEN RAISE EXCEPTION 'anonymous lead leak'; END IF;
  IF EXISTS(SELECT 1 FROM public.analytics_events) THEN RAISE EXCEPTION 'anonymous analytics leak'; END IF;
  BEGIN
    PERFORM public.admin_analytics_summary();
    RAISE EXCEPTION 'anonymous summary bypass';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
UPDATE public.profiles SET role='admin', is_active=false WHERE id=auth.uid();
DO $$ BEGIN
  IF public.is_admin() THEN RAISE EXCEPTION 'role escalation'; END IF;
  IF (SELECT role FROM public.profiles WHERE id=auth.uid()) <> 'user' THEN RAISE EXCEPTION 'role altered'; END IF;
  IF EXISTS(SELECT 1 FROM public.profiles WHERE id<>auth.uid()) THEN RAISE EXCEPTION 'other profile leak'; END IF;
  BEGIN
    PERFORM public.admin_analytics_summary();
    RAISE EXCEPTION 'non-admin summary bypass';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
INSERT INTO public.analytics_events(event_type, visitor_id, user_id, page_url, created_at)
 VALUES('page_view','security_visitor_001','10000000-0000-4000-8000-000000000002','/security-test','2000-01-01');
RESET ROLE;
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM public.analytics_events WHERE visitor_id='security_visitor_001'
    AND user_id='10000000-0000-4000-8000-000000000001' AND created_at=now()) THEN
    RAISE EXCEPTION 'event identity or timestamp spoof';
  END IF;
END $$;
SELECT set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  IF public.is_admin() THEN RAISE EXCEPTION 'blocked admin bypass'; END IF;
  BEGIN
    PERFORM public.admin_analytics_summary();
    RAISE EXCEPTION 'blocked summary bypass';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
DO $$ DECLARE stats jsonb; BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'active admin denied'; END IF;
  stats := public.admin_analytics_summary();
  IF (stats->>'totalVisits')::bigint <> (SELECT count(*) FROM public.analytics_events WHERE event_type='page_view') THEN
    RAISE EXCEPTION 'truncated totals';
  END IF;
  IF jsonb_array_length(stats->'days') <> 7 THEN RAISE EXCEPTION 'missing chart days'; END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
  IF public.reset_password_with_code('security-normal@example.invalid','123456','weak')->>'error' <> 'weak_password' THEN RAISE EXCEPTION 'weak password accepted'; END IF;
  IF NOT private.allow_request('isolated-test', 1, 60) THEN RAISE EXCEPTION 'first request denied'; END IF;
  IF private.allow_request('isolated-test', 1, 60) THEN RAISE EXCEPTION 'rate limit bypass'; END IF;
END $$;
ROLLBACK;
SELECT 'PASS: anonymous access, cross-user access, privilege escalation, blocked admin, event identity/time, exact totals, rate limit, password rules; fixtures rolled back' AS security_test_result;
