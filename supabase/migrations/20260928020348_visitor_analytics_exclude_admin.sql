-- One filtered dataset feeds both the overview and the paginated event log.
-- Existing raw events remain intact.
CREATE TABLE public.analytics_excluded_visitors (
  visitor_id text PRIMARY KEY CHECK (visitor_id ~ '^[a-zA-Z0-9_-]{10,64}$'),
  excluded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_excluded_visitors ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.analytics_excluded_visitors FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.analytics_excluded_visitors TO authenticated;
CREATE POLICY "admins_read_excluded_browsers" ON public.analytics_excluded_visitors
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY "admins_exclude_own_browser" ON public.analytics_excluded_visitors
  FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_admin()) AND excluded_by=(SELECT auth.uid()));
CREATE INDEX idx_analytics_excluded_by ON public.analytics_excluded_visitors(excluded_by);

INSERT INTO public.analytics_excluded_visitors(visitor_id, excluded_by)
  SELECT DISTINCT ON (e.visitor_id) e.visitor_id, e.user_id
  FROM public.analytics_events e JOIN public.profiles p ON p.id=e.user_id
  WHERE p.role='admin' AND e.visitor_id ~ '^[a-zA-Z0-9_-]{10,64}$'
  ORDER BY e.visitor_id, e.created_at DESC
ON CONFLICT DO NOTHING;

CREATE VIEW public.analytics_visitor_events WITH (security_invoker=true) AS
  SELECT e.* FROM public.analytics_events e
  WHERE coalesce(e.page_url, '') NOT LIKE '/admin%'
    AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id=e.user_id AND p.role='admin')
    AND NOT EXISTS (SELECT 1 FROM public.analytics_excluded_visitors excluded WHERE excluded.visitor_id=e.visitor_id)
    AND NOT EXISTS (
      SELECT 1 FROM public.analytics_events history
      JOIN public.profiles p ON p.id=history.user_id
      WHERE p.role='admin' AND history.visitor_id=e.visitor_id
    );
REVOKE ALL ON public.analytics_visitor_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.analytics_visitor_events TO authenticated;

CREATE OR REPLACE FUNCTION private.guard_public_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  NEW.created_at := now();
  IF TG_TABLE_NAME = 'analytics_events' THEN
    IF coalesce(NEW.visitor_id, '') !~ '^[a-zA-Z0-9_-]{10,64}$' THEN
      RAISE EXCEPTION 'Invalid visitor identifier' USING ERRCODE = '22023';
    END IF;
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role='admin') THEN
      INSERT INTO public.analytics_excluded_visitors(visitor_id, excluded_by)
        VALUES(NEW.visitor_id, auth.uid()) ON CONFLICT DO NOTHING;
      RETURN NULL;
    END IF;
    IF NEW.page_url LIKE '/admin%' OR EXISTS (
      SELECT 1 FROM public.analytics_excluded_visitors WHERE visitor_id=NEW.visitor_id
    ) THEN RETURN NULL; END IF;
    IF NOT private.allow_request('analytics', 120, 60) THEN RETURN NULL; END IF;
    IF NEW.event_type NOT IN ('page_view','heartbeat','whatsapp_click','instagram_click','form_submit','language_change','login','registration')
      OR octet_length(coalesce(NEW.event_data, '{}')::text) > 2048
      OR coalesce(NEW.page_url, '') NOT LIKE '/%'
      OR coalesce(NEW.visitor_id, '') !~ '^[a-zA-Z0-9_-]{10,64}$' THEN
      RAISE EXCEPTION 'Invalid analytics event' USING ERRCODE = '22023';
    END IF;
    -- Identity and time cannot be supplied on behalf of somebody else.
    NEW.user_id := auth.uid();
    IF NEW.event_type IN ('login','registration') AND NEW.user_id IS NULL THEN RETURN NULL; END IF;
  ELSE
    IF NOT private.allow_request('lead', 5, 3600) THEN
      RAISE EXCEPTION 'Too many requests. Please try again later.' USING ERRCODE = 'P0001';
    END IF;
    NEW.status := 'new';
    NEW.name := trim(NEW.name);
    NEW.phone := trim(NEW.phone);
    IF length(regexp_replace(NEW.phone, '[^0-9]', '', 'g')) NOT BETWEEN 9 AND 15 THEN
      RAISE EXCEPTION 'Invalid phone number' USING ERRCODE = '22023';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.guard_public_insert() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_analytics_summary()
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE result jsonb;
  today timestamptz := date_trunc('day', now() AT TIME ZONE 'Asia/Dushanbe') AT TIME ZONE 'Asia/Dushanbe';
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied' USING ERRCODE = '42501'; END IF;
  SELECT jsonb_build_object(
    'totalVisits', count(*) FILTER (WHERE event_type = 'page_view'),
    'uniqueVisitors', count(DISTINCT visitor_id) FILTER (WHERE event_type = 'page_view'),
    'instagramVisitors', count(DISTINCT visitor_id) FILTER (WHERE event_type = 'page_view' AND source='instagram'),
    'whatsappVisitors', count(DISTINCT visitor_id) FILTER (WHERE event_type = 'page_view' AND source='whatsapp'),
    'viewsToday', count(*) FILTER (WHERE event_type = 'page_view' AND created_at >= today),
    'viewsWeek', count(*) FILTER (WHERE event_type = 'page_view' AND created_at >= today - interval '6 days'),
    'whatsappClicks', count(*) FILTER (WHERE event_type = 'whatsapp_click'),
    'instagramClicks', count(*) FILTER (WHERE event_type = 'instagram_click'),
    'onlineNow', count(DISTINCT visitor_id) FILTER (WHERE event_type IN ('page_view','heartbeat') AND created_at >= now() - interval '2 minutes')
  ) INTO result FROM public.analytics_visitor_events;
  result := result || (SELECT jsonb_build_object(
    'totalUsers', count(*), 'newToday', count(*) FILTER (WHERE created_at >= today),
    'newMonth', count(*) FILTER (WHERE created_at >= now() - interval '30 days')
  ) FROM public.profiles WHERE role = 'user');
  result := result || jsonb_build_object('formSubmits', (SELECT count(*) FROM public.leads));
  result := result || jsonb_build_object('sources', (SELECT coalesce(jsonb_agg(s), '[]') FROM (
    SELECT coalesce(source, 'unknown') AS key, count(*) AS views, count(DISTINCT visitor_id) AS visitors
    FROM public.analytics_visitor_events WHERE event_type='page_view' GROUP BY source ORDER BY count(*) DESC
  ) s));
  result := result || jsonb_build_object('days', (SELECT jsonb_agg(d ORDER BY day) FROM (
    SELECT day::date, count(e.id) FILTER (WHERE e.event_type='page_view') AS visits,
      count(e.id) FILTER (WHERE e.event_type='whatsapp_click') AS clicks
    FROM generate_series((today AT TIME ZONE 'Asia/Dushanbe') - interval '6 days', today AT TIME ZONE 'Asia/Dushanbe', interval '1 day') day
    LEFT JOIN public.analytics_visitor_events e ON e.created_at >= (day AT TIME ZONE 'Asia/Dushanbe')
      AND e.created_at < ((day + interval '1 day') AT TIME ZONE 'Asia/Dushanbe')
    GROUP BY day
  ) d));
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_analytics_summary() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_analytics_summary() TO authenticated;
