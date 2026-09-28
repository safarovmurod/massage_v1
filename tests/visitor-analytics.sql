-- Production-safe regression check: every fixture is rolled back.
BEGIN;
INSERT INTO auth.users(id, email, raw_user_meta_data) VALUES
 ('20000000-0000-4000-8000-000000000001','visitor-test@example.invalid','{}'),
 ('20000000-0000-4000-8000-000000000002','visitor-admin@example.invalid','{}'),
 ('20000000-0000-4000-8000-000000000003','visitor-blocked@example.invalid','{}');
UPDATE public.profiles SET role='admin' WHERE id IN ('20000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000003');
UPDATE public.profiles SET is_active=false WHERE id='20000000-0000-4000-8000-000000000003';
SELECT set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
CREATE TEMP TABLE analytics_baseline AS SELECT public.admin_analytics_summary() AS stats;
GRANT SELECT ON analytics_baseline TO authenticated;

-- More than 1,000 accepted events; the API row limit must not truncate totals.
SELECT set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM public.analytics_visitor_events) THEN RAISE EXCEPTION 'customer can read analytics'; END IF;
  IF EXISTS(SELECT 1 FROM public.analytics_excluded_visitors) THEN RAISE EXCEPTION 'customer can read exclusions'; END IF;
  BEGIN
    INSERT INTO public.analytics_excluded_visitors(visitor_id, excluded_by) VALUES('visitor_test_bad', auth.uid());
    RAISE EXCEPTION 'customer can exclude visitors';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  FOR counter IN 1..1005 LOOP
    PERFORM set_config('request.headers', jsonb_build_object('x-forwarded-for','visitor-test-' || counter)::text, true);
    INSERT INTO public.analytics_events(event_type, visitor_id, page_url, source)
      VALUES('page_view','visitor_test_bulk_' || counter,'/','instagram');
  END LOOP;
END $$;
SELECT set_config('request.headers', '{"x-forwarded-for":"visitor-test-extra"}', true);
INSERT INTO public.analytics_events(event_type, visitor_id, page_url, source) VALUES
 ('page_view','visitor_test_bulk_1','/contact','instagram'),
 ('page_view','visitor_test_bulk_1','/','whatsapp'),
 ('whatsapp_click','visitor_test_bulk_1','/','whatsapp'),
 ('page_view','visitor_test_guest','/','unknown'),
 ('page_view','visitor_test_admin','/','instagram'),
 ('page_view','visitor_test_admin','/admin','instagram');
RESET ROLE;

-- On administrator login, previous anonymous views of that browser disappear
-- from both reports, while the raw historical record is preserved.
SELECT set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
INSERT INTO public.analytics_events(event_type, visitor_id, page_url, source)
  VALUES('page_view','visitor_test_admin','/contact','instagram');
INSERT INTO public.analytics_excluded_visitors(visitor_id, excluded_by)
  VALUES('visitor_test_optout', auth.uid()) ON CONFLICT DO NOTHING;
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000003","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
INSERT INTO public.analytics_events(event_type, visitor_id, page_url, source)
  VALUES('page_view','visitor_test_blocked','/','whatsapp');
RESET ROLE;
SELECT set_config('request.jwt.claims', '{}', true);
SET LOCAL ROLE anon;
INSERT INTO public.analytics_events(event_type, visitor_id, page_url, source) VALUES
 ('page_view','visitor_test_admin','/','instagram'),
 ('page_view','visitor_test_optout','/','instagram');
RESET ROLE;
DO $$ BEGIN
  IF (SELECT count(*) FROM public.analytics_events WHERE visitor_id='visitor_test_admin') <> 1 THEN
    RAISE EXCEPTION 'admin events accepted or raw history removed'; END IF;
  IF EXISTS(SELECT 1 FROM public.analytics_events WHERE visitor_id IN ('visitor_test_optout','visitor_test_blocked')) THEN
    RAISE EXCEPTION 'excluded browser or inactive admin accepted'; END IF;
END $$;

SELECT set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
DO $$ DECLARE stats jsonb; before_stats jsonb; source_total bigint; BEGIN
  SELECT analytics_baseline.stats INTO before_stats FROM analytics_baseline;
  stats := public.admin_analytics_summary();
  IF (stats->>'totalVisits')::bigint - (before_stats->>'totalVisits')::bigint <> 1008 THEN RAISE EXCEPTION 'views count wrong'; END IF;
  IF (stats->>'uniqueVisitors')::bigint - (before_stats->>'uniqueVisitors')::bigint <> 1006 THEN RAISE EXCEPTION 'unique visitors wrong'; END IF;
  IF (stats->>'instagramVisitors')::bigint - (before_stats->>'instagramVisitors')::bigint <> 1005 THEN RAISE EXCEPTION 'instagram arrivals wrong'; END IF;
  IF (stats->>'whatsappVisitors')::bigint - (before_stats->>'whatsappVisitors')::bigint <> 1 THEN RAISE EXCEPTION 'whatsapp arrivals wrong'; END IF;
  IF (stats->>'whatsappClicks')::bigint - (before_stats->>'whatsappClicks')::bigint <> 1 THEN RAISE EXCEPTION 'outbound clicks wrong'; END IF;
  IF (stats->>'viewsToday')::bigint - (before_stats->>'viewsToday')::bigint <> 1008 THEN RAISE EXCEPTION 'daily views wrong'; END IF;
  IF (stats->>'onlineNow')::bigint - (before_stats->>'onlineNow')::bigint <> 1006 THEN RAISE EXCEPTION 'online count wrong'; END IF;
  SELECT sum((item->>'views')::bigint) INTO source_total FROM jsonb_array_elements(stats->'sources') item;
  IF source_total <> (stats->>'totalVisits')::bigint THEN RAISE EXCEPTION 'source totals disagree'; END IF;
  IF (stats->>'totalVisits')::bigint <> (SELECT count(*) FROM public.analytics_visitor_events WHERE event_type='page_view') THEN RAISE EXCEPTION 'log and overview disagree'; END IF;
  IF EXISTS(SELECT 1 FROM public.analytics_visitor_events WHERE visitor_id='visitor_test_admin') THEN RAISE EXCEPTION 'admin present in log'; END IF;
END $$;
RESET ROLE;
ROLLBACK;
SELECT 'PASS: admin and signed-out browser excluded, inactive admin excluded, RLS, 1008 views, 1006 unique browsers, source deduplication, clicks separated, dashboard/log match; fixtures rolled back' AS result;
