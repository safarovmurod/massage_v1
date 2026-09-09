-- ============================================================
-- Миграция 08 — ограничение длины полей заявки
--
-- Заявку с сайта отправляет анонимный посетитель (политика
-- leads_insert_public), поэтому длину полей ограничиваем на уровне базы —
-- чтобы нельзя было залить в таблицу мусор мегабайтами.
--
-- Применено на проекте 2026-09-09.
-- ============================================================

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_sane_lengths;
ALTER TABLE public.leads ADD CONSTRAINT leads_sane_lengths CHECK (
  length(name) BETWEEN 2 AND 100 AND
  length(phone) BETWEEN 5 AND 40 AND
  coalesce(length(message), 0) <= 1000 AND
  coalesce(length(preferred_time), 0) <= 100 AND
  coalesce(length(for_whom), 0) <= 20
) NOT VALID;
