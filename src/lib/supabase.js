import { createClient } from '@supabase/supabase-js'

// --- Запасные значения проекта ---
// Это ПУБЛИЧНЫЕ данные: URL проекта и publishable (anon) ключ. Они в любом
// случае попадают в JS-бандл и видны в браузере — это их штатный режим работы.
// Доступ к данным закрывают RLS-политики в Supabase, а не секретность ключа.
// Никогда не класть сюда service_role ключ.
const FALLBACK_URL = 'https://alafwzjqxwjanoqrirwi.supabase.co'
const FALLBACK_KEY = 'sb_publishable_pttATYOLyVLJ3FTOLiCWZw_MhL2nCQ6'

// Значения из окружения могут прийти пустыми, с пробелами/переводом строки
// или вовсе оставленным placeholder'ом ("your_supabase_url_here").
// Поэтому каждое значение валидируем и при мусоре берём fallback.
const clean = (v) => (typeof v === 'string' ? v.trim().replace(/\/+$/, '') : '')

const isBadPlaceholder = (v) =>
  !v || /your[_-]?supabase|your[_-]?project|placeholder|undefined|null|xxx/i.test(v)

const pickUrl = (envValue) => {
  const v = clean(envValue)
  if (isBadPlaceholder(v) || !/^https?:\/\/.+\..+/.test(v)) return FALLBACK_URL
  return v
}

const pickKey = (envValue) => {
  const v = clean(envValue)
  // Валидный ключ: JWT (eyJ...) либо новый формат sb_publishable_...
  if (isBadPlaceholder(v) || v.length < 20) return FALLBACK_KEY
  if (!/^(eyJ|sb_publishable_|sbp_)/.test(v)) return FALLBACK_KEY
  return v
}

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = pickUrl(envUrl)
const supabaseAnonKey = pickKey(envKey)

// Если переменная окружения задана, но мусорная (например, в Vercel в поле
// VITE_SUPABASE_URL случайно вставили строку "VITE_SUPABASE_ANON_KEY=..."),
// сайт продолжит работать на запасных значениях, но об этом надо знать.
if (envUrl && supabaseUrl !== clean(envUrl)) {
  console.warn('[supabase] VITE_SUPABASE_URL задан неверно — используются запасные значения. Проверьте переменные окружения.')
}
if (envKey && supabaseAnonKey !== clean(envKey)) {
  console.warn('[supabase] VITE_SUPABASE_ANON_KEY задан неверно — используются запасные значения. Проверьте переменные окружения.')
}

export const isSupabaseConfigured = () =>
  !!(supabaseUrl && supabaseAnonKey && /^https?:\/\//.test(supabaseUrl))

// Заглушка — используется, только если по какой-то причине конфиг всё же невалиден
const mockError = () => { throw new Error('Supabase not configured.') }
const mockQuery = () => ({
  data: [], error: null,
  select: mockQuery, insert: mockQuery, update: mockQuery,
  upsert: mockQuery, delete: mockQuery, order: mockQuery,
  eq: mockQuery, limit: mockQuery,
  single: async () => ({ data: null, error: null }),
})

const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: mockError,
    signInWithPassword: mockError,
    signInWithOAuth: mockError,
    signOut: async () => {},
    resetPasswordForEmail: mockError,
    updateUser: mockError,
  },
  from: mockQuery,
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : mockClient
