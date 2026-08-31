-- ============================================================
-- МИГРАЦИЯ 03: Сброс пароля по 6-значному КОДУ (без email/SMTP)
-- ============================================================
-- Зачем: встроенный SMTP Supabase присылает всего ~2 письма в час.
-- Поэтому добавляем второй путь: клиент оставляет заявку -> админ
-- видит её в админ-панели, выдаёт 6-значный код и передаёт его
-- клиенту в WhatsApp -> клиент вводит код и новый пароль на сайте.
--
-- Запускать в Supabase -> SQL Editor -> Run.
-- Скрипт безопасно запускать повторно (idempotent).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ---------- 1. Таблица заявок на сброс пароля ----------
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  code        TEXT,                                  -- 6 цифр, виден только админу
  status      TEXT NOT NULL DEFAULT 'pending',       -- pending | code_issued | used | rejected
  attempts    INT  NOT NULL DEFAULT 0,               -- неудачные попытки ввода кода
  lang        TEXT DEFAULT 'ru',
  note        TEXT,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  issued_at   TIMESTAMPTZ,
  used_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_prr_email   ON public.password_reset_requests(email);
CREATE INDEX IF NOT EXISTS idx_prr_status  ON public.password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_prr_created ON public.password_reset_requests(created_at DESC);

ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Читать/менять заявки может ТОЛЬКО админ.
DROP POLICY IF EXISTS "prr_admin_all"    ON public.password_reset_requests;
DROP POLICY IF EXISTS "prr_admin_select" ON public.password_reset_requests;
CREATE POLICY "prr_admin_select" ON public.password_reset_requests
  FOR SELECT USING (public.is_admin());
CREATE POLICY "prr_admin_update" ON public.password_reset_requests
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "prr_admin_delete" ON public.password_reset_requests
  FOR DELETE USING (public.is_admin());
-- INSERT только через функцию ниже (SECURITY DEFINER), напрямую никому нельзя.


-- ---------- 2. Клиент оставляет заявку (доступно всем) ----------
CREATE OR REPLACE FUNCTION public.request_password_reset(p_email TEXT, p_lang TEXT DEFAULT 'ru')
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_user_id UUID;
  v_recent INT;
BEGIN
  IF v_email IS NULL OR v_email = '' OR position('@' in v_email) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  -- анти-спам: не более 3 заявок в час на один email
  SELECT count(*) INTO v_recent
  FROM public.password_reset_requests
  WHERE email = v_email AND created_at > now() - interval '1 hour';

  IF v_recent >= 3 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'too_many');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_email LIMIT 1;

  -- Заявку создаём даже если пользователя нет — чтобы не раскрывать,
  -- какие email зарегистрированы. Админ увидит пометку.
  INSERT INTO public.password_reset_requests (user_id, email, lang, status, note)
  VALUES (
    v_user_id, v_email, coalesce(p_lang, 'ru'), 'pending',
    CASE WHEN v_user_id IS NULL THEN 'Пользователь с таким email не найден' ELSE NULL END
  );

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.request_password_reset(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT, TEXT) TO anon, authenticated;


-- ---------- 3. Админ выдаёт 6-значный код ----------
CREATE OR REPLACE FUNCTION public.admin_issue_reset_code(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_row public.password_reset_requests;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Доступ запрещён');
  END IF;

  SELECT * INTO v_row FROM public.password_reset_requests WHERE id = p_request_id;
  IF v_row.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Заявка не найдена');
  END IF;
  IF v_row.user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Пользователь с таким email не зарегистрирован');
  END IF;

  v_code := lpad((floor(random() * 1000000))::INT::TEXT, 6, '0');

  UPDATE public.password_reset_requests
  SET code = v_code, status = 'code_issued', attempts = 0,
      issued_at = now(), expires_at = now() + interval '30 minutes'
  WHERE id = p_request_id;

  RETURN jsonb_build_object('ok', true, 'code', v_code,
                            'email', v_row.email,
                            'expires_at', now() + interval '30 minutes');
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_issue_reset_code(UUID) TO authenticated;


-- ---------- 4. Админ выдаёт код сразу по email (без заявки) ----------
CREATE OR REPLACE FUNCTION public.admin_create_reset_code_for_email(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_user_id UUID;
  v_code TEXT;
  v_id UUID;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Доступ запрещён');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Пользователь с таким email не найден');
  END IF;

  v_code := lpad((floor(random() * 1000000))::INT::TEXT, 6, '0');

  INSERT INTO public.password_reset_requests
    (user_id, email, code, status, issued_at, expires_at, note)
  VALUES
    (v_user_id, v_email, v_code, 'code_issued', now(), now() + interval '30 minutes',
     'Код создан администратором вручную')
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'code', v_code, 'id', v_id, 'email', v_email);
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_create_reset_code_for_email(TEXT) TO authenticated;


-- ---------- 5. Клиент меняет пароль по коду (доступно всем) ----------
CREATE OR REPLACE FUNCTION public.reset_password_with_code(
  p_email TEXT, p_code TEXT, p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_code  TEXT := regexp_replace(coalesce(p_code, ''), '\D', '', 'g');
  v_row   public.password_reset_requests;
BEGIN
  IF length(coalesce(p_new_password, '')) < 6 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'weak_password');
  END IF;

  -- последняя выданная заявка по этому email
  SELECT * INTO v_row
  FROM public.password_reset_requests
  WHERE email = v_email AND status = 'code_issued'
  ORDER BY issued_at DESC NULLS LAST
  LIMIT 1;

  IF v_row.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_code');
  END IF;

  IF v_row.expires_at IS NOT NULL AND v_row.expires_at < now() THEN
    UPDATE public.password_reset_requests SET status = 'rejected', note = 'Код истёк'
    WHERE id = v_row.id;
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;

  IF v_row.attempts >= 5 THEN
    UPDATE public.password_reset_requests SET status = 'rejected', note = 'Слишком много попыток'
    WHERE id = v_row.id;
    RETURN jsonb_build_object('ok', false, 'error', 'too_many');
  END IF;

  IF v_row.code IS DISTINCT FROM v_code THEN
    UPDATE public.password_reset_requests SET attempts = attempts + 1 WHERE id = v_row.id;
    RETURN jsonb_build_object('ok', false, 'error', 'bad_code',
                              'left', 5 - (v_row.attempts + 1));
  END IF;

  -- код верный -> меняем пароль
  UPDATE auth.users
  SET encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at = now()
  WHERE id = v_row.user_id;

  UPDATE public.password_reset_requests
  SET status = 'used', used_at = now(), code = NULL
  WHERE id = v_row.id;

  -- пишем в журнал действий пользователя (таблица из миграции 02)
  BEGIN
    INSERT INTO public.user_activity (user_id, action, details)
    VALUES (v_row.user_id, 'password_reset_code', jsonb_build_object('email', v_email));
  EXCEPTION WHEN others THEN NULL;
  END;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.reset_password_with_code(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_password_with_code(TEXT, TEXT, TEXT) TO anon, authenticated;


-- ---------- 6. Проверка ----------
SELECT 'Миграция 03 применена' AS status,
       (SELECT count(*) FROM public.password_reset_requests) AS requests_count;
