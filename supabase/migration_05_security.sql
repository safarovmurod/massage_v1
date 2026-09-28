-- ============================================================
-- Миграция 05 — безопасность профилей
-- Вставить целиком в Supabase → SQL Editor → Run
--
-- ПРОБЛЕМА:
-- политика "profiles_update_own" разрешает пользователю менять ЛЮБЫЕ
-- поля своей строки, включая role и is_active. То есть любой
-- зарегистрированный человек мог из браузера выполнить
--   supabase.from('profiles').update({ role: 'admin' }).eq('id', <свой id>)
-- и получить доступ в админку. RLS не умеет ограничивать отдельные
-- колонки, поэтому закрываем это триггером.
-- ============================================================

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- auth.uid() пустой = запрос не от пользователя сайта
  -- (SQL Editor, service_role, триггер handle_new_user) — не мешаем.
  IF auth.uid() IS NULL OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.role := 'user';
    NEW.is_active := TRUE;
    RETURN NEW;
  END IF;

  -- Обычный пользователь не может менять привилегированные поля
  NEW.role := OLD.role;
  NEW.is_active := OLD.is_active;
  NEW.id := OLD.id;
  NEW.created_at := OLD.created_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_fields ON public.profiles;

CREATE TRIGGER protect_profile_fields
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- ============================================================
-- Проверка (выполнить после Run):
--   SELECT tgname FROM pg_trigger WHERE tgname = 'protect_profile_fields';
-- Должна вернуться одна строка.
-- ============================================================
