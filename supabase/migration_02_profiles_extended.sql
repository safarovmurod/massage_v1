-- ============================================================
-- МИГРАЦИЯ 02: расширенные профили клиентов + журнал действий
-- Запускать в Supabase → SQL Editor → Run
-- Безопасно перезапускать.
-- ============================================================

-- ===== 1. НОВЫЕ ПОЛЯ В PROFILES =====
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name    TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name     TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone         TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date    DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender        TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nationality   TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country       TEXT DEFAULT 'Таджикистан';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS region        TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city          TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address       TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url    TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notes         TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active     BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lang          TEXT DEFAULT 'ru';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_count   INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT now();

-- Пол — только допустимые значения
DO $$ BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_gender_check
    CHECK (gender IS NULL OR gender IN ('male','female','other'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===== 2. ЖУРНАЛ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ =====
CREATE TABLE IF NOT EXISTS public.user_activity (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action      TEXT NOT NULL,          -- login / logout / register / profile_update / password_reset ...
  details     JSONB,
  page_url    TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_date ON public.user_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_phone     ON public.profiles (phone);
CREATE INDEX IF NOT EXISTS idx_profiles_active    ON public.profiles (is_active);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ua_insert_self"   ON public.user_activity;
DROP POLICY IF EXISTS "ua_select_self"   ON public.user_activity;
DROP POLICY IF EXISTS "ua_select_admin"  ON public.user_activity;

CREATE POLICY "ua_insert_self" ON public.user_activity
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "ua_select_self" ON public.user_activity
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "ua_select_admin" ON public.user_activity
  FOR SELECT TO authenticated USING (public.is_admin());

-- ===== 3. АДМИН МОЖЕТ УДАЛЯТЬ ПРОФИЛИ =====
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;
CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE TO authenticated USING (public.is_admin());

-- ===== 4. ТРИГГЕР РЕГИСТРАЦИИ: пишем все переданные поля =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE m JSONB;
BEGIN
  m := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

  INSERT INTO public.profiles (
    id, email, full_name, first_name, last_name, phone,
    birth_date, gender, nationality, country, region, city,
    address, avatar_url, lang, role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(m->>'full_name', TRIM(CONCAT(m->>'first_name',' ',m->>'last_name'))),
    m->>'first_name',
    m->>'last_name',
    m->>'phone',
    CASE WHEN (m->>'birth_date') ~ '^\d{4}-\d{2}-\d{2}$'
         THEN (m->>'birth_date')::date ELSE NULL END,
    m->>'gender',
    m->>'nationality',
    COALESCE(m->>'country', 'Таджикистан'),
    m->>'region',
    m->>'city',
    m->>'address',
    m->>'avatar_url',
    COALESCE(m->>'lang','ru'),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_activity (user_id, action, details)
  VALUES (NEW.id, 'register', jsonb_build_object('email', NEW.email));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== 5. АДМИН-ФУНКЦИЯ: СБРОС ПАРОЛЯ КЛИЕНТУ =====
-- Пароль в базе хранится как bcrypt-хеш и НЕ может быть показан.
-- Админ задаёт новый пароль и передаёт его клиенту.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.admin_set_user_password(
  target_user_id UUID,
  new_password   TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Доступ запрещён');
  END IF;
  IF length(new_password) < 6 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Пароль минимум 6 символов');
  END IF;

  UPDATE auth.users
  SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Пользователь не найден');
  END IF;

  INSERT INTO public.user_activity (user_id, action, details)
  VALUES (target_user_id, 'password_reset_by_admin',
          jsonb_build_object('by', auth.uid()));

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_user_password(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_user_password(UUID, TEXT) TO authenticated;

-- ===== 6. АДМИН-ФУНКЦИЯ: ПОЛНАЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ =====
CREATE OR REPLACE FUNCTION public.admin_get_user_details(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('error', 'Доступ запрещён');
  END IF;

  SELECT jsonb_build_object(
    'profile', to_jsonb(p) - 'id',
    'auth', jsonb_build_object(
      'email',              u.email,
      'email_confirmed',    u.email_confirmed_at IS NOT NULL,
      'phone_auth',         u.phone,
      'created_at',         u.created_at,
      'last_sign_in_at',    u.last_sign_in_at,
      'provider',           u.raw_app_meta_data->>'provider',
      'banned_until',       u.banned_until,
      'password_is_hashed', true
    ),
    'activity', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'action', a.action, 'details', a.details,
               'page_url', a.page_url, 'created_at', a.created_at
             ) ORDER BY a.created_at DESC)
      FROM (SELECT * FROM public.user_activity
            WHERE user_id = target_user_id
            ORDER BY created_at DESC LIMIT 100) a
    ), '[]'::jsonb),
    'leads_count', (SELECT count(*) FROM public.leads l WHERE l.phone = p.phone)
  )
  INTO result
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE p.id = target_user_id;

  RETURN COALESCE(result, jsonb_build_object('error','Пользователь не найден'));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_user_details(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_user_details(UUID) TO authenticated;

-- ===== 7. СЕМЕНА КОНТЕНТА (все 3 языка) =====
INSERT INTO public.site_content (key, value) VALUES
  ('hero.title.ru','Баночный массаж для здоровья, лёгкости и восстановления'),
  ('hero.title.tj','Массажи бонкагӣ барои саломатӣ ва барқарорсозӣ'),
  ('hero.title.en','Cupping massage for health, lightness and recovery'),
  ('hero.card1.price.ru','70 сомони'),
  ('hero.card1.price.tj','70 сомонӣ'),
  ('hero.card1.price.en','70 somoni'),
  ('pricing.card1.price.ru','70 сомони'),
  ('pricing.card1.price.tj','70 сомонӣ'),
  ('pricing.card1.price.en','70 somoni')
ON CONFLICT (key) DO NOTHING;

-- ===== ПРОВЕРКА =====
SELECT email, role, is_active, phone, city, login_count
FROM public.profiles ORDER BY created_at DESC;
