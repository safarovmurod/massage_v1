-- ============================================================
-- Миграция 06 — права на вызов функций через REST API
--
-- Проверка Supabase (Security Advisor) показала: все SECURITY DEFINER
-- функции по умолчанию доступны роли PUBLIC, то есть их можно дёрнуть
-- из браузера по /rest/v1/rpc/<имя> вообще без входа.
-- Внутри админских функций есть проверка is_admin(), но лишний рубеж
-- не мешает: анонимный посетитель не должен их даже видеть.
--
-- Применено на проекте 2026-09-09.
-- ============================================================

-- Триггерные функции никто не должен вызывать через API.
-- Права на триггер проверяются в момент CREATE TRIGGER, поэтому
-- регистрация (handle_new_user) после этого продолжает работать — проверено.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_privileged_fields() FROM PUBLIC, anon, authenticated;

-- Админские функции — только для вошедшего пользователя (роль проверяется внутри)
REVOKE ALL ON FUNCTION public.admin_create_reset_code_for_email(TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_delete_test_users()               FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_delete_user(UUID)                 FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_issue_reset_code(UUID)            FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_get_user_details(UUID)            FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_user_password(UUID, TEXT)     FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_create_reset_code_for_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_test_users()               TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID)                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_issue_reset_code(UUID)            TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_user_details(UUID)            TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_password(UUID, TEXT)     TO authenticated;

-- Восстановление пароля нужно человеку, который ещё не вошёл — оставляем открытым
GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT, TEXT)          TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_password_with_code(TEXT, TEXT, TEXT)  TO anon, authenticated;

-- is_admin() трогать НЕЛЬЗЯ: её вызывают сами RLS-политики от имени anon
-- и authenticated. Если забрать права — сломается чтение таблиц.
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
