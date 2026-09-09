-- ============================================================
-- Миграция 07 — «кто и откуда заходил на сайт»
--
-- Раньше в analytics_events не было ни посетителя, ни источника перехода,
-- а сам просмотр страницы вообще нигде не записывался. Поэтому статистика
-- посещений всегда была пустой.
--
-- visitor_id — случайная строка из localStorage браузера. Позволяет отличить
--   «10 просмотров одного человека» от «10 разных людей». Личных данных нет.
-- user_id    — заполняется, только если человек вошёл в аккаунт. Тогда в
--   админке видно имя, а не «Гость».
-- source     — откуда пришёл: instagram / whatsapp / telegram / google /
--   direct. Берётся из utm_source в ссылке или из referrer браузера.
--
-- Применено на проекте 2026-09-09.
-- ============================================================

ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS visitor_id TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT;

CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON public.analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_source  ON public.analytics_events (source);
CREATE INDEX IF NOT EXISTS idx_analytics_user    ON public.analytics_events (user_id);

-- Раньше аноним мог записать в аналитику что угодно, включая чужой user_id.
-- Теперь можно указать только свой.
DROP POLICY IF EXISTS "analytics_insert_public" ON public.analytics_events;
CREATE POLICY "analytics_insert_public" ON public.analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Защита от мусорных огромных строк
ALTER TABLE public.analytics_events DROP CONSTRAINT IF EXISTS analytics_sane_lengths;
ALTER TABLE public.analytics_events ADD CONSTRAINT analytics_sane_lengths CHECK (
  coalesce(length(event_type), 0) <= 40 AND
  coalesce(length(page_url), 0)   <= 200 AND
  coalesce(length(user_agent), 0) <= 300 AND
  coalesce(length(referrer), 0)   <= 300 AND
  coalesce(length(source), 0)     <= 40 AND
  coalesce(length(visitor_id), 0) <= 64
) NOT VALID;
