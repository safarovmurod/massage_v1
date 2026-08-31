-- ============================================================
-- МИГРАЦИЯ 04: Удаление пользователей ИЗ АДМИН-ПАНЕЛИ
-- ============================================================
-- Зачем: чтобы больше НЕ нужно было заходить в SQL Editor.
-- После этой миграции в админке появится кнопка "Удалить" —
-- и тестовых/лишних пользователей можно удалять мышкой.
--
-- Запускать в Supabase -> SQL Editor -> Run. Можно повторно.
-- ============================================================

-- ---------- 1. Удалить ОДНОГО пользователя ----------
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Доступ запрещён');
  END IF;

  -- Защита: нельзя удалить самого себя
  IF target_user_id = auth.uid() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Нельзя удалить свой собственный аккаунт');
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = target_user_id;
  IF v_email IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Пользователь не найден');
  END IF;

  -- Защита: нельзя удалить последнего администратора
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id AND role = 'admin')
     AND (SELECT count(*) FROM public.profiles WHERE role = 'admin') <= 1 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Это последний администратор — удалить нельзя');
  END IF;

  -- Чистим связанные записи (на случай отсутствия ON DELETE CASCADE)
  BEGIN DELETE FROM public.user_activity WHERE user_id = target_user_id; EXCEPTION WHEN others THEN NULL; END;
  BEGIN DELETE FROM public.password_reset_requests WHERE user_id = target_user_id; EXCEPTION WHEN others THEN NULL; END;
  BEGIN DELETE FROM public.profiles WHERE id = target_user_id; EXCEPTION WHEN others THEN NULL; END;

  -- auth.identities + auth.sessions удалятся каскадом вместе с auth.users
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object('ok', true, 'email', v_email);
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;


-- ---------- 2. Удалить ВСЕХ тестовых пользователей одной кнопкой ----------
-- Удаляет только НЕ-админов, чей email начинается на test / testuser
-- или совпадает с мусорным 'твой@email.com'.
CREATE OR REPLACE FUNCTION public.admin_delete_test_users()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_ids UUID[];
  v_emails TEXT[];
  v_count INT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Доступ запрещён');
  END IF;

  SELECT array_agg(u.id), array_agg(u.email)
  INTO v_ids, v_emails
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.id <> auth.uid()
    AND coalesce(p.role, 'user') <> 'admin'
    AND (
      lower(u.email) LIKE 'test%@%'
      OR lower(u.email) LIKE 'testuser%@%'
      OR u.email = 'твой@email.com'
    );

  IF v_ids IS NULL THEN
    RETURN jsonb_build_object('ok', true, 'deleted', 0, 'emails', '[]'::jsonb);
  END IF;

  BEGIN DELETE FROM public.user_activity WHERE user_id = ANY(v_ids); EXCEPTION WHEN others THEN NULL; END;
  BEGIN DELETE FROM public.password_reset_requests WHERE user_id = ANY(v_ids); EXCEPTION WHEN others THEN NULL; END;
  BEGIN DELETE FROM public.profiles WHERE id = ANY(v_ids); EXCEPTION WHEN others THEN NULL; END;

  DELETE FROM auth.users WHERE id = ANY(v_ids);
  v_count := array_length(v_ids, 1);

  RETURN jsonb_build_object('ok', true, 'deleted', v_count, 'emails', to_jsonb(v_emails));
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_delete_test_users() TO authenticated;


SELECT 'Миграция 04 применена ✅ — теперь можно удалять клиентов кнопкой в админке' AS status;
