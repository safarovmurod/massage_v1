import { createClient } from '@supabase/supabase-js'

// --- Рабочие значения проекта (fallback) ---
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

const supabaseUrl = pickUrl(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = pickKey(import.meta.env.VITE_SUPABASE_ANON_KEY)

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
