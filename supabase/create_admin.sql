-- ============================================================
-- СОЗДАНИЕ АДМИНА НАПРЯМУЮ В БАЗЕ (без письма-подтверждения)
-- Запускать в Supabase → SQL Editor → Run
-- Можно запускать повторно — обновит пароль существующего админа.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
  -- ⬇⬇⬇ ЗАМЕНИ ЭТИ ДВЕ СТРОКИ НА СВОИ ⬇⬇⬇
  v_email    TEXT := 'admin@massage.tj';
  v_password TEXT := 'Admin123456';
  -- ⬆⬆⬆ ЗАМЕНИ ЭТИ ДВЕ СТРОКИ НА СВОИ ⬆⬆⬆

  v_name     TEXT := 'Администратор';
  v_user_id  UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    -- Новый пользователь
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated', v_email,
      extensions.crypt(v_password, extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      json_build_object('full_name', v_name)::jsonb,
      '', '', '', ''
    );

    -- provider_id должен быть TEXT — обязателен явный ::text
    INSERT INTO auth.identities (
      provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      v_user_id::text, v_user_id,
      json_build_object(
        'sub', v_user_id::text,
        'email', v_email,
        'email_verified', true
      )::jsonb,
      'email', now(), now(), now()
    );

    RAISE NOTICE 'Создан новый пользователь: %', v_email;
  ELSE
    -- Пользователь есть — обновляем пароль и подтверждаем email
    UPDATE auth.users
    SET encrypted_password = extensions.crypt(v_password, extensions.gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at         = now()
    WHERE id = v_user_id;

    RAISE NOTICE 'Обновлён пароль для: %', v_email;
  END IF;

  -- Профиль + роль admin
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_user_id, v_email, v_name, 'admin')
  ON CONFLICT (id) DO UPDATE
    SET role  = 'admin',
        email = EXCLUDED.email;
END $$;

-- ============================================================
-- ПРОВЕРКА
-- ============================================================
SELECT
  p.email,
  p.role,
  (u.email_confirmed_at IS NOT NULL) AS email_подтверждён
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'admin';
